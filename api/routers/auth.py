from typing import List

from fastapi import APIRouter, HTTPException
import requests
import jwt
from pydantic import BaseModel

from api.vars import AUTH_URL, SECRET_KEY, DB_URL
from api.routers.log import save_log
from api.routers.infos import get_genres

router = APIRouter()


class UserLogin(BaseModel):
    username: str
    hashPassword: str


class UserInfo(BaseModel):
    name: str
    lastname: str
    language: str
    preferenceGenres: list


@router.post("/login")
def login_user(user_login: UserLogin):
    response = requests.post(AUTH_URL + "/auth/login",
                             json={"username": user_login.username, "hashPassword": user_login.hashPassword})
    if response.status_code == 200:
        token = response.json()
        save_log("POST Login {username: " + user_login.username + "} : status_code=200",
                 jwt.decode(token["token"], SECRET_KEY, algorithms=["HS256"])["userId"])
        return {"userId": jwt.decode(token["token"], SECRET_KEY, algorithms=["HS256"])["userId"],
                "token": token["token"]}
    elif response.status_code == 401:
        save_log("POST Login {username: " + user_login.username + "} : status_code=401")
        raise HTTPException(status_code=401, detail="Invalid username or password")
    else:
        save_log("POST Login {username: " + user_login.username + "} : status_code=500")
        raise HTTPException(status_code=500, detail="An error occurred")


@router.post("/register")
def register_user(userLogin: UserLogin, userInfos: UserInfo):

    genres = get_genres()
    for genre in userInfos.preferenceGenres:
        if genre not in genres:
            save_log("POST Register : Genre not recognize status_code=400")
            raise HTTPException(status_code=400, detail="Genre not recognize")
    response = requests.post(AUTH_URL + "/auth/register",
                             json={"username": userLogin.username, "hashPassword": userLogin.hashPassword})


    if response.status_code == 201:
        token = login_user(userLogin)
        payload = jwt.decode(token.get('token'), SECRET_KEY, algorithms=["HS256"])
        requests.post(DB_URL + "/profil/firstConnection",
                      json={"username": userLogin.username, "userId": payload.get('userId'),
                            "name": userInfos.name, "lastname": userInfos.lastname,
                            "language": userInfos.language, "preferenceGenres": userInfos.preferenceGenres})

        save_log("POST Register {username: " + userLogin.username + "} : status_code=200",
                 payload.get('userId'))
        return {"userId": payload.get('userId'), "token": token["token"]}
    elif response.status_code == 409:
        save_log("POST Register {username: " + userLogin.username + "} : status_code=409")
        raise HTTPException(status_code=409, detail="User already exists")
    else:
        save_log("POST Register {username: " + userLogin.username + "} : status_code=500")
        raise HTTPException(status_code=500, detail="An error occurred")
