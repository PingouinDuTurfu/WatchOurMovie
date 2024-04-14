from fastapi import APIRouter, HTTPException
import requests

from api.vars import DB_URL
from api.routers.infos import get_genres,verify_lang, transform_to_movie
from api.routers.log import save_log

router = APIRouter()


@router.get("/movies/{page}")
def get_movies(page: int, language: str):
    if not (verify_lang(language)):
        save_log("GET Movies {page: " + str(page) + ", language: " + language + "} : status_code=404")
        raise HTTPException(status_code=404, detail="Language not found")
    response = requests.post(DB_URL + "/movie/discover", json={"page": page, "language": language})
    if response.status_code == 200 or response.status_code == 201:
        result_movie = []
        movies = response.json()
        genre = {genre["id"]: genre["name"] for genre in get_genres()}
        for movie in movies:
            result_movie.append(transform_to_movie(movie, genre))
        save_log("GET Movies {page: " + str(page) + ", language: " + language + "} : status_code=200")
        return result_movie
    else:
        save_log("GET Movies {page: " + str(page) + ", language: " + language + "} : status_code=500")
        raise HTTPException(status_code=500, detail="An error occurred")


@router.get("/movies/{title_search}/{page}")
def get_movies(title_search: str, page: int, language: str):
    if not (verify_lang(language)):
        save_log("GET Movies {title_search: " + title_search + "page: " + str(
            page) + ", language: " + language + "} : status_code=404")
        raise HTTPException(status_code=404, detail="Language not found")
    response = requests.post(DB_URL + "/movie/search",
                             json={"page": page, "query": title_search, "language": language})
    if response.status_code == 200 or response.status_code == 201:
        result_movie = []
        movies = response.json()
        genre = {genre["id"]: genre["name"] for genre in get_genres()}
        for movie in movies:
            result_movie.append(transform_to_movie(movie, genre))
        save_log("GET Movies {title_search: " + title_search + "page: " + str(
            page) + ", language: " + language + "} : status_code=200")
        return result_movie
    else:
        save_log("GET Movies {title_search: " + title_search + "page: " + str(
            page) + ", language: " + language + "} : status_code=500")
        raise HTTPException(status_code=500, detail="An error occurred")


@router.get("/movie/{movie_id}")
def get_movie_by_id(movie_id: int, language: str):
    if not (verify_lang(language)):
        save_log("GET Movie {movie_id: " + str(movie_id) + ", language: " + language + "} : status_code=404")
        raise HTTPException(status_code=404, detail="Language not found")
    response = requests.post(DB_URL + "/movie/", json={"id": movie_id, "language": language})
    if response.status_code == 200 or response.status_code == 201:
        movie = response.json()
        genre = {genre["id"]: genre["name"] for genre in get_genres()}
        save_log("GET Movie {movie_id: " + str(movie_id) + ", language: " + language + "} : status_code=200")
        return transform_to_movie(movie, genre)
    else:
        save_log("GET Movie {movie_id: " + str(movie_id) + ", language: " + language + "} : status_code=500")
        raise HTTPException(status_code=500, detail="An error occurred")

