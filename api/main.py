from collections import Counter

from fastapi import FastAPI, HTTPException, Header
import requests
import jwt
from fastapi.params import Depends
from pydantic import BaseModel

app = FastAPI()

URL = "http://localhost:3000/"
SECRET_KEY = "4b8e08f2c3a4d5e6f7101234567890abcdef1234567890abcdef1234567890ab"

pre_image = "https://image.tmdb.org/t/p/original"


class UserLogin(BaseModel):
    username: str
    hashPassword: str

class Group(BaseModel):
    groupName: str


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
        print(response.json)
        movies = response.json()
        return movies
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.get("/movie/{movie_id}")
def get_movie_by_id(movie_id: int):
    response = requests.post("http://localhost:3001/movie/", json={"id": movie_id})
    if response.status_code == 200 or response.status_code == 201:
        print(response.json)
        movie = response.json()
        return movie
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.get("/profil/{user_id}")
def get_user_profile(user_id: str, token_payload: dict = Depends(verify_token)):
    # if not token_payload:
    #     raise HTTPException(status_code=401, detail="Invalid JWT token")
    print(token_payload)
    # Make request to external service to get profile info
    response = requests.get("http://localhost:3001/profil/", params={"userId": user_id})
    if response.status_code == 200:
        profile_data = response.json()
        return profile_data
    else:
        raise HTTPException(status_code=404, detail="Profile not found")


@app.get("/profils")
def get_user_profile():
    # Make request to external service to get profile info
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
        print(response.json)
        genres = response.json()
        return genres
    else:
        raise HTTPException(status_code=500, detail="An error occurred")


@app.get("/groups")
def get_groups(token_payload: dict = Depends(verify_token)):
    response = requests.get("http://localhost:3001/group/list")
    if response.status_code == 200:
        group_names = {}
        for entry in response.json():
            print(entry)
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
        print(response.json)
        token = response.json()
        return token
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


@app.post("/group/recommendation")
def get_group_recommendation(language: str):
    # Placeholder implementation, replace with actual logic
    return {"recommendation": "Some recommendation based on language"}


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
