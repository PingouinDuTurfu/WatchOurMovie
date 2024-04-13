import collections
from collections import Counter
from typing import List, Annotated

from fastapi import FastAPI, HTTPException, Header, Body
import requests
import jwt
from fastapi.params import Depends
from pydantic import BaseModel

app = FastAPI()

URL = "http://localhost:3000/"
SECRET_KEY = "4b8e08f2c3a4d5e6f7101234567890abcdef1234567890abcdef1234567890ab"


class UserLogin(BaseModel):
    username: str
    hashPassword: str


class UserInfo(BaseModel):
    name: str
    lastname: str
    language: str
    preferenceGenres: list


class Group(BaseModel):
    groupName: str

class UpdatePreferenceGenre(BaseModel):
    preferenceGenres: List[dict]

class UpdateLanguage(BaseModel):
    language: str

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
def verify_lang(language):
    languages = get_languages()
    for lang in languages:
        if lang["iso_639_1"] == language:
            return True
    return False


@app.get("/movies/{page}")
def get_movies(page: int, language: str):
    if not (verify_lang(language)):
        raise HTTPException(status_code=404, detail="Language not found")
    response = requests.post("http://localhost:3001/movie/discover", json={"page": page, "language": language})
    if response.status_code == 200 or response.status_code == 201:
        result_movie = []
        movies = response.json()
        genre = {genre["id"]: genre["name"] for genre in get_genres()}
        for movie in movies:
            result_movie.append(transform_to_movie(movie, genre))
        return result_movie
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.get("/movies/{title_search}/{page}")
def get_movies(title_search: str, page: int, language: str):
    if not (verify_lang(language)):
        raise HTTPException(status_code=404, detail="Language not found")
    response = requests.post("http://localhost:3001/movie/search",
                             json={"page": page, "query": title_search, "language": language})
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
def get_movie_by_id(movie_id: int, language: str):
    if not (verify_lang(language)):
        raise HTTPException(status_code=404, detail="Language not found")
    response = requests.post("http://localhost:3001/movie/", json={"id": movie_id, "language": language})
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
    if response.status_code == 200 and response.json():
        return response.json()
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.get("/group/infos/{groupName}")
def get_group_by_id(groupName: str):
    response = requests.get("http://localhost:3001/group/", params={"groupName": groupName})
    print(response.status_code)
    if response.status_code == 200:
        group = response.json()
        result = []
        genres_counter = collections.defaultdict(int)
        for member in group:
            result.append(transform_to_user(member))
            for genre in member["preferenceGenres"]:
                genres_counter[genre["id"]] += 1
        genres = get_genres()
        genre = {genre["id"]: genre["name"] for genre in genres}
        most_common_genres = Counter(genres_counter).most_common(3)
        preferenceGenres = []
        for info in most_common_genres:
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
def get_group_recommendation(language: str, groupName: str, onMoviesSeen: bool, token_payload: dict = Depends(verify_token)):
    if not (verify_lang(language)):
        raise HTTPException(status_code=404, detail="Language not found")
    response = requests.get("http://localhost:3001/group/", params={"groupName": groupName})
    if response.status_code == 200:
        members = response.json()
        movies_seen_counter = collections.defaultdict(int)
        genres_counter = collections.defaultdict(int)
        movies_seen = set()

        for member_data in members:
            member_movies_seen = member_data["moviesSeen"]
            member_preference_genre = member_data["preferenceGenres"]
            for movie in member_movies_seen:
                movie_id = movie.get("id")
                movies_seen_counter[movie_id] += 1
                movies_seen.add(movie_id)
            for genre in member_preference_genre:
                genre_id = genre.get("id")
                genres_counter[genre_id] += 1

        most_seen_movies = Counter(movies_seen_counter).most_common(10)
        most_common_genres = Counter(genres_counter).most_common(3)

        most_common_genre_ids = [genre[0] for genre in most_common_genres]

        recommendations = []
        recommended_movie_ids = set()

        if movies_seen and not onMoviesSeen:
            recommendations, recommended_movie_ids = recommendation_with_movie(most_seen_movies, language, movies_seen,
                                                                               recommended_movie_ids, recommendations,
                                                                               most_common_genre_ids)
        else:
            recommendations, recommended_movie_ids = recommendation_without_movie(language, movies_seen,
                                                                                  recommended_movie_ids,
                                                                                  recommendations,
                                                                                  most_common_genre_ids)

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


def recommendation_with_movie(most_seen_movies: list, language: str, movies_seen: set, recommended_movie_ids: set,
                              recommendations: list, most_common_genre_ids: list):
    if not (verify_lang(language)):
        raise HTTPException(status_code=404, detail="Language not found")
    for movie_id, _ in most_seen_movies:
        response = requests.post("http://localhost:3001/movie/recommendation/",
                                 json={"movieId": movie_id, "language": language})
        if response.status_code == 200 or response.status_code == 201:
            data = response.json()
            for movie in data:
                if (movie['id'] not in movies_seen and movie['id'] not in recommended_movie_ids
                        and any(genre_id in movie['genre_ids'] for genre_id in most_common_genre_ids)):
                    recommendations.append(movie)
                    recommended_movie_ids.add(movie['id'])
    # if len(recommendations)<20:
    #     recommendations, recommended_movie_ids = recommendation_without_movie(language, movies_seen,
    #                                                                           recommended_movie_ids, recommendations,
    #                                                                           most_common_genre_ids)
    return recommendations, recommended_movie_ids


def recommendation_without_movie(language: str, movies_seen: set, recommended_movie_ids: set,
                                 recommendations: list, most_common_genre_ids: list):
    if not (verify_lang(language)):
        raise HTTPException(status_code=404, detail="Language not found")
    for genre in most_common_genre_ids:

        response = requests.post("http://localhost:3001/movie/discover/",
                                 json={"with_genres": genre, "language": language})
        if response.status_code == 200 or response.status_code == 201:
            data = response.json()
            for movie in data:
                if movie['id'] not in movies_seen and movie['id'] not in recommended_movie_ids:
                    print(movie)
                    recommendations.append(movie)
                    recommended_movie_ids.add(movie['id'])
    return recommendations, recommended_movie_ids


@app.post("/group/create")
def create_group(group: Group, token_payload: dict = Depends(verify_token)):
    print(token_payload)
    response = requests.post("http://localhost:3001/group/create",
                             json={"userId": token_payload.get("userId"), "groupName": group.groupName})
    if response.status_code == 200:
        token = response.json()
        return {"userId": token_payload.get("userId"), "token": token}
    elif response.status_code == 409:
        raise HTTPException(status_code=409, detail="Group already exists")
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.post("/login")
def login_user(user_login: UserLogin):
    response = requests.post("http://localhost:3000/auth/login",
                             json={"username": user_login.username, "hashPassword": user_login.hashPassword})
    if response.status_code == 200:
        token = response.json()
        return {"userId": jwt.decode(token["token"], SECRET_KEY, algorithms=["HS256"])["userId"],
                "token": token["token"]}
    elif response.status_code == 401:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.post("/register")
def register_user(userLogin: UserLogin, userInfos: UserInfo):
    response = requests.post("http://localhost:3000/auth/register",
                             json={"username": userLogin.username, "hashPassword": userLogin.hashPassword})
    genres = get_genres()
    for genre in userInfos.preferenceGenres:
        if genre not in genres:
            raise HTTPException(status_code=400, detail="Genre not recognize")

    if response.status_code == 201:
        # to connect the user
        token = login_user(userLogin)
        for key in token:
            print(key)
        payload = jwt.decode(token.get('token'), SECRET_KEY, algorithms=["HS256"])
        print(payload)
        requests.post("http://localhost:3001/profil/firstConnection",
                      json={"username": userLogin.username, "userId": payload.get('userId'),
                            "name": userInfos.name, "lastname": userInfos.lastname,
                            "language": userInfos.language, "preferenceGenres": userInfos.preferenceGenres})

        return {"userId": payload.get('userId'), "token": token["token"]}
    elif response.status_code == 409:
        raise HTTPException(status_code=409, detail="User already exists")
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.post("/updateGenre")
def update_pref_genre(preferenceGenres: UpdatePreferenceGenre,
                      token_payload: dict = Depends(verify_token)):
    genres = get_genres()
    for genre in preferenceGenres.preferenceGenres:
        if genre not in genres:
            raise HTTPException(status_code=400, detail="Genre not recognize")

    response = requests.post("http://localhost:3001/profil/updateGenre",
                             json={"userId": token_payload.get("userId"), "preferenceGenres": preferenceGenres.preferenceGenres})
    print(response.status_code)
    if response.status_code == 200:
        return response.json()
    elif response.status_code == 409:
        raise HTTPException(status_code=409, detail="User already exists")
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.post("/updateLang")
def update_lang(language: UpdateLanguage,
                token_payload: dict = Depends(verify_token)):
    if not (verify_lang(language.language)):
        raise HTTPException(status_code=404, detail="Language not found")

    response = requests.post("http://localhost:3001/profil/updateLanguage",
                             json={"userId": token_payload.get("userId"), "language": language.language})
    print(response.status_code)
    if response.status_code == 200:
        return response.json()
    elif response.status_code == 409:
        raise HTTPException(status_code=409, detail="User already exists")
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.post("/addMovie")
def add_movie(id: Annotated[int, Body(...)], title: Annotated[str, Body(...)], language: str,
              token_payload: dict = Depends(verify_token)):

    if not (verify_lang(language)):
        raise HTTPException(status_code=404, detail="Language not found")
    try:
        movie = get_movie_by_id(id, language)
    except:
        raise HTTPException(status_code=503, detail="Id movie not found")
    response = requests.get("http://localhost:3001/profil/", params={"userId": token_payload.get("userId")})
    if response.status_code == 200:
        user = response.json()

        if any(item.get("id") == id for item in user["moviesSeen"]):
            raise HTTPException(status_code=409, detail="Movie already seen")
        response = requests.post("http://localhost:3001/profil/addSeenMovie",
                                 json={"userId": token_payload.get("userId"),
                                       "movie": {"title": movie.get("title"), "image": movie.get("image"), "id": id}})
        print(response.status_code)

        if response.status_code == 200:
            return response.json()
        elif response.status_code == 409:
            raise HTTPException(status_code=409, detail="User already exists")
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.post("/removeMovie")
def remove_movie(id: Annotated[int, Body(...)], title: Annotated[str, Body(...)], language: str,
                 token_payload: dict = Depends(verify_token)):
    if not(verify_lang(language)):
        raise HTTPException(status_code=404, detail="Language not found")
    try:
        get_movie_by_id(id, language)
    except:
        raise HTTPException(status_code=503, detail="Id movie not found")
    response = requests.get("http://localhost:3001/profil/", params={"userId": token_payload.get("userId")})
    if response.status_code == 200:
        user = response.json()

        for movie in user["moviesSeen"]:
            if movie.get("id") == id:
                response = requests.post("http://localhost:3001/profil/removeSeenMovie",
                                         json={"userId": token_payload.get("userId"),
                                               "movie": {"title": movie.get("title"), "id": movie.get("id")}})

        if response.status_code == 200:
            return response.json()
        elif response.status_code == 409:
            raise HTTPException(status_code=409, detail="User already exists")
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=4269)
