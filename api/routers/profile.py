from typing import List

from fastapi import APIRouter, HTTPException
import requests
from fastapi.params import Depends
from pydantic import BaseModel

from api.vars import DB_URL
from api.routers.infos import get_genres, verify_token, verify_lang
from api.routers.log import save_log
from api.routers.movie import get_movie_by_id

router = APIRouter()


class UpdatePreferenceGenre(BaseModel):
    preferenceGenres: List[dict]


class UpdateLanguage(BaseModel):
    language: str


class AddMovie(BaseModel):
    id: int
    language: str


class RemoveMovie(BaseModel):
    id: int
    language: str


@router.get("/profil/{user_id}")
def get_user_profile(user_id: str, token_payload: dict = Depends(verify_token)):
    response = requests.get(DB_URL + "/profil/", params={"userId": user_id})
    if response.status_code == 200:
        profile_data = response.json()
        save_log("GET Profile {user_id: " + user_id + "} : status_code=200", token_payload.get("userId"))
        return profile_data
    else:
        save_log("GET Profile {user_id: " + user_id + "} : status_code=404", token_payload.get("userId"))
        raise HTTPException(status_code=404, detail="Profile not found")


@router.get("/profils")
def get_user_profile():
    response = requests.get(DB_URL + "/profil/list")
    if response.status_code == 200:
        profile_data = response.json()

        save_log("GET Profiles : status_code=200")
        return profile_data
    else:
        save_log("GET Profiles : status_code=404")
        raise HTTPException(status_code=404, detail="Profiles not found")


@router.post("/updateGenre")
def update_pref_genre(preferenceGenres: UpdatePreferenceGenre,
                      token_payload: dict = Depends(verify_token)):
    genres = get_genres()
    for genre in preferenceGenres.preferenceGenres:
        if genre not in genres:
            save_log("POST Update Genre {preferenceGenres: " + str(
                preferenceGenres.preferenceGenres) + "} : status_code=400", token_payload.get("userId"))
            raise HTTPException(status_code=400, detail="Genre not recognize")

    response = requests.post(DB_URL + "/profil/updateGenre",
                             json={"userId": token_payload.get("userId"),
                                   "preferenceGenres": preferenceGenres.preferenceGenres})
    if response.status_code == 200:
        save_log(
            "POST Update Genre {preferenceGenres: " + str(preferenceGenres.preferenceGenres) + "} : status_code=200",
            token_payload.get("userId"))
        return response.json()
    elif response.status_code == 409:
        save_log(
            "POST Update Genre {preferenceGenres: " + str(preferenceGenres.preferenceGenres) + "} : status_code=409",
            token_payload.get("userId"))
        raise HTTPException(status_code=409, detail="User already exists")
    else:
        save_log(
            "POST Update Genre {preferenceGenres: " + str(preferenceGenres.preferenceGenres) + "} : status_code=500",
            token_payload.get("userId"))
        raise HTTPException(status_code=500, detail="An error occurred")


@router.post("/updateLang")
def update_lang(language: UpdateLanguage,
                token_payload: dict = Depends(verify_token)):
    if not (verify_lang(language.language)):
        save_log(
            "POST Update Language {language: " + str(language.language) + "} : status_code=404",
            token_payload.get("userId"))
        raise HTTPException(status_code=404, detail="Language not found")

    response = requests.post(DB_URL + "/profil/updateLanguage",
                             json={"userId": token_payload.get("userId"), "language": language.language})
    if response.status_code == 200:
        save_log(
            "POST Update Language {language: " + str(language.language) + "} : status_code=200",
            token_payload.get("userId"))
        return response.json()
    elif response.status_code == 409:
        save_log(
            "POST Update Language {language: " + str(language.language) + "} : status_code=404",
            token_payload.get("userId"))
        raise HTTPException(status_code=409, detail="User already exists")
    else:
        save_log(
            "POST Update Language {language: " + str(language.language) + "} : status_code=404",
            token_payload.get("userId"))
        raise HTTPException(status_code=500, detail="An error occurred")


@router.post("/addMovie")
def add_movie(movieToAdd: AddMovie,
              token_payload: dict = Depends(verify_token)):
    if not (verify_lang(movieToAdd.language)):
        save_log(
            "POST Add Movie {movieToAdd: " + str(movieToAdd) + "} : status_code=404",
            token_payload.get("userId"))
        raise HTTPException(status_code=404, detail="Language not found")
    try:
        movie = get_movie_by_id(movieToAdd.id, movieToAdd.language)
    except:
        save_log(
            "POST Add Movie {movieToAdd: " + str(movieToAdd) + "} : status_code=503",
            token_payload.get("userId"))
        raise HTTPException(status_code=503, detail="Id movie not found")
    response = requests.get(DB_URL + "/profil/", params={"userId": token_payload.get("userId")})
    if response.status_code == 200:
        user = response.json()

        if any(item.get("id") == movieToAdd.id for item in user["moviesSeen"]):
            save_log(
                "POST Add Movie {movieToAdd: " + str(movieToAdd) + "} : status_code=409",
                token_payload.get("userId"))
            raise HTTPException(status_code=409, detail="Movie already seen")
        response = requests.post(DB_URL + "/profil/addSeenMovie",
                                 json={"userId": token_payload.get("userId"),
                                       "movie": {"title": movie.get("title"), "image": movie.get("image"),
                                                 "id": movie.get("id")}})

        if response.status_code == 200:
            save_log(
                "POST Add Movie {movieToAdd: " + str(movieToAdd) + "} : status_code=200",
                token_payload.get("userId"))
            return response.json()
        elif response.status_code == 409:
            save_log(
                "POST Add Movie {movieToAdd: " + str(movieToAdd) + "} : status_code=409",
                token_payload.get("userId"))
            raise HTTPException(status_code=409, detail="User already exists")
    else:
        save_log(
            "POST Add Movie {movieToAdd: " + str(movieToAdd) + "} : status_code=500",
            token_payload.get("userId"))
        raise HTTPException(status_code=500, detail="An error occurred")


@router.post("/removeMovie")
def remove_movie(movieToRemove: RemoveMovie,
                 token_payload: dict = Depends(verify_token)):
    if not (verify_lang(movieToRemove.language)):
        save_log(
            "POST Remove Movie {movieToRemove: " + str(movieToRemove) + "} : status_code=404",
            token_payload.get("userId"))
        raise HTTPException(status_code=404, detail="Language not found")
    try:
        get_movie_by_id(movieToRemove.id, movieToRemove.language)
    except:
        save_log(
            "POST Remove Movie {movieToRemove: " + str(movieToRemove) + "} : status_code=503",
            token_payload.get("userId"))
        raise HTTPException(status_code=503, detail="Id movie not found")
    response = requests.get(DB_URL + "/profil/", params={"userId": token_payload.get("userId")})
    if response.status_code == 200:
        user = response.json()

        for movie in user["moviesSeen"]:
            if movie.get("id") == movieToRemove.id:
                response = requests.post(DB_URL + "/profil/removeSeenMovie",
                                         json={"userId": token_payload.get("userId"),
                                               "movie": {"title": movie.get("title"), "id": movie.get("id")}})

        if response.status_code == 200:
            save_log(
                "POST Remove Movie {movieToRemove: " + str(movieToRemove) + "} : status_code=200",
                token_payload.get("userId"))
            return response.json()
        elif response.status_code == 409:
            save_log(
                "POST Remove Movie {movieToRemove: " + str(movieToRemove) + "} : status_code=409",
                token_payload.get("userId"))
            raise HTTPException(status_code=409, detail="User already exists")
    else:
        save_log(
            "POST Remove Movie {movieToRemove: " + str(movieToRemove) + "} : status_code=500",
            token_payload.get("userId"))
        raise HTTPException(status_code=500, detail="An error occurred")
