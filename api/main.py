from collections import Counter

from fastapi import FastAPI, HTTPException, Header
import requests
import jwt
from fastapi.params import Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3003"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

URL = "http://localhost:3000/"
SECRET_KEY = "4b8e08f2c3a4d5e6f7101234567890abcdef1234567890abcdef1234567890ab"


class UserLogin(BaseModel):
    username: str
    hashPassword: str


class Group(BaseModel):
    groupName: str


def transform_to_movie(movie_data, genres):
    movie_object = {
        "title": movie_data.get("title", ""),
        "image": f"https://image.tmdb.org/t/p/original{movie_data.get('poster_path', '')}",
        "overview": movie_data.get("overview", ""),
        "id": movie_data.get("id", ""),
        "year": movie_data.get("release_date", "").split("-")[0],
        "genres": [genres.get(genre_id, "") for genre_id in movie_data.get("genre_ids", [])],
        "vote_count": movie_data.get("vote_count", 0),
        "vote_average": movie_data.get("vote_average", 0),
        "popularity": movie_data.get("popularity", "")
    }
    return movie_object


def transform_to_user(user_data):
    movie_object = {
        "userId": user_data.get("userId", ""),
        "username": user_data.get("username", ""),
        "name": user_data.get("name", ""),
        "lastname": user_data.get("lastname", "")
    }
    return movie_object


async def get_token_auth_header(authorization: str = Header(...)):
    if authorization is None:
        raise HTTPException(status_code=401, detail="Authorization header is missing")
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    return parts[1]


def verify_token(token: str = Depends(get_token_auth_header)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload


# Routes
@app.get("/movies")
def get_movies():
    response = requests.post("http://localhost:3001/movie/discover")
    if response.status_code == 200 or response.status_code == 201:
        result_movie = []
        movies = response.json()
        genre = {genre["id"]: genre["name"] for genre in get_genres()}
        for movie in movies:
            result_movie.append(transform_to_movie(movie, genre))
        return result_movie
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.get("/movie/{movie_id}")
def get_movie_by_id(movie_id: int):
    response = requests.post("http://localhost:3001/movie/", json={"id": movie_id})
    if response.status_code == 200 or response.status_code == 201:
        print(response.json)
        movie = response.json()
        genre = {genre["id"]: genre["name"] for genre in get_genres()}
        return transform_to_movie(movie, genre)
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.get("/profil/{user_id}")
def get_user_profile(user_id: str, token_payload: dict = Depends(verify_token)):
    # if not token_payload:
    #     raise HTTPException(status_code=401, detail="Invalid JWT token")
    print(token_payload)
    response = requests.get("http://localhost:3001/profil/", params={"userId": user_id})
    if response.status_code == 200:
        profile_data = response.json()
        genre = {genre["id"]: genre["name"] for genre in get_genres()}
        return profile_data
    else:
        raise HTTPException(status_code=404, detail="Profile not found")


@app.get("/profils")
def get_user_profile():
    response = requests.get("http://localhost:3001/profil/list")
    if response.status_code == 200:
        profile_data = response.json()
        return profile_data
    else:
        raise HTTPException(status_code=404, detail="Profile not found")


@app.get("/langs")
def get_languages():
    response = requests.get("http://localhost:3001/language/list")
    if response.status_code == 200:
        print(response.json)
        languages = response.json()
        return languages
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.get("/genres")
def get_genres():
    response = requests.get("http://localhost:3001/genre/list")
    if response.status_code == 200:
        genres = response.json()
        return genres
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.get("/groups")
def get_groups():
    response = requests.get("http://localhost:3001/group/list")
    if response.status_code == 200:
        group_names = {}
        for entry in response.json():
            for group in entry.get('groups'):
                group_name = group['groupName']
                # Increment count for the group name
                group_names[group_name] = group_names.get(group_name, 0) + 1

        return group_names
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.get("/group/infos/{groupName}")
def get_group_by_id(groupName: str):
    response = requests.get("http://localhost:3001/group/", params={"groupName": groupName})
    if response.status_code == 200:
        group = response.json()
        result = []
        genres_counter = Counter()
        for member in group:
            result.append(transform_to_user(member))
            genres_counter.update(member["preferenceGenres"])
        genres = get_genres()
        genre = {genre["id"]: genre["name"] for genre in genres}
        preferenceGenres = []
        for info in genres_counter.most_common(3):
            preferenceGenres.append({"name": genre.get(int(info[0]), ""), "freq": info[1]})
        return {"groupName": groupName, "members": result, "preferenceGenres": preferenceGenres}
    elif response.status_code == 404:
        raise HTTPException(status_code=404, detail="Group not found")
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.post("/group/join")
def join_group(group: Group, token_payload: dict = Depends(verify_token)):
    response = requests.post("http://localhost:3001/group/join",
                             json={"userId": token_payload.get("userId"), "groupName": group.groupName})
    if response.status_code == 200:
        print(response.json)
        token = response.json()
        return token
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.post("/group/leave")
def leave_group(group: Group, token_payload: dict = Depends(verify_token)):
    response = requests.post("http://localhost:3001/group/leave",
                             json={"userId": token_payload.get("userId"), "groupName": group.groupName})
    if response.status_code == 200:
        print(response.json)
        token = response.json()
        return token
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.get("/group/recommendation")
def get_group_recommendation(language: str, groupName: str, random: bool, token_payload: dict = Depends(verify_token)):
    print("groupnameé :" + groupName)
    response = requests.get("http://localhost:3001/group/", params={"groupName": groupName})
    if response.status_code == 200:
        members = response.json()
        movies_seen_counter = Counter()
        genres_counter = Counter()
        movies_seen = set()

        for member_data in members:
            movies_seen_counter.update(member_data["moviesSeen"])
            genres_counter.update(member_data["preferenceGenres"])
            movies_seen.update(member_data["moviesSeen"])

        most_seen_movies = movies_seen_counter.most_common(10)
        most_common_genres = genres_counter.most_common(3)
        most_common_genre_ids = [genre[0] for genre in most_common_genres]

        recommendations = []
        recommended_movie_ids = set()

        if movies_seen and not random:
            # Attention pas encore testé
            for movie_id, _ in most_seen_movies:
                response = requests.post("http://localhost:3001/movie/recommendation/",
                                         json={"movieId": movie_id, "language": language})
                if response.status_code == 201:
                    data = response.json()
                    for movie in data['results']:
                        if (movie['id'] not in movies_seen and movie['id'] not in recommended_movie_ids
                                and all(genre_id in movie['genre_ids'] for genre_id in most_common_genre_ids)):
                            recommendations.append(movie)
                            recommended_movie_ids.add(movie['id'])

        else:
            for genre in most_common_genre_ids:

                response = requests.post("http://localhost:3001/movie/discover/",
                                         json={"with_genres": genre, "language": language})
                if response.status_code == 201:
                    data = response.json()
                    for movie in data:
                        if movie['id'] not in movies_seen and movie['id'] not in recommended_movie_ids:
                            print(movie)
                            recommendations.append(movie)
                            recommended_movie_ids.add(movie['id'])

        sorted_recommendations = sorted(recommendations, key=lambda x: x['popularity'], reverse=True)
        result_reco = []
        genres = get_genres()
        genre = {genre["id"]: genre["name"] for genre in genres}
        for reco in sorted_recommendations:
            result_reco.append(transform_to_movie(reco, genre))
        return result_reco
    elif response.status_code == 404:
        raise HTTPException(status_code=404, detail="Group not found")
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.post("/group/create")
def create_group(group: Group, token_payload: dict = Depends(verify_token)):
    print(token_payload)
    response = requests.post("http://localhost:3001/group/create",
                             json={"userId": token_payload.get("userId"), "groupName": group.groupName})
    if response.status_code == 200:
        print(response.json)
        token = response.json()
        return token
    elif response.status_code == 409:
        raise HTTPException(status_code=409, detail="Group already exists")
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.post("/login")
def login_user(user_login: UserLogin):
    response = requests.post("http://localhost:3000/auth/login",
                             json={"username": user_login.username, "hashPassword": user_login.hashPassword})
    if response.status_code == 200:
        print(response.json)
        token = response.json()
        return token
    elif response.status_code == 401:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.post("/register")
def register_user(userLogin: UserLogin):
    response = requests.post("http://localhost:3000/auth/register",
                             json={"username": userLogin.username, "hashPassword": userLogin.hashPassword})
    if response.status_code == 201:
        # to connect the user
        token = login_user(userLogin)
        for key in token:
            print(key)
        payload = jwt.decode(token.get('token'), SECRET_KEY, algorithms=["HS256"])
        print(payload)
        response = requests.post("http://localhost:3001/profil/firstConnection",
                                 json={"username": userLogin.username, "userId": payload.get('userId'),
                                       "name": "aaaaaaaaaaaaaaaa", "lastname": "bbbbbbbbbbbbbbbb", "age": True,
                                       "language": "fr", "preferenceGenres": [28, 16, 35]})

        print(response)
        return token
    elif response.status_code == 409:
        raise HTTPException(status_code=409, detail="User already exists")
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=4269)
