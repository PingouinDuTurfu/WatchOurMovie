from fastapi import APIRouter
import requests
import jwt
from fastapi import HTTPException, Header
from fastapi.params import Depends

from api.vars import SECRET_KEY, DB_URL

from api.routers.log import save_log

router = APIRouter()


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


def verify_lang(language):
    languages = get_languages()
    for lang in languages:
        if lang["iso_639_1"] == language:
            return True
    return False
@router.get("/langs")
def get_languages():
    response = requests.get(DB_URL + "/language/list")
    if response.status_code == 200:
        languages = response.json()
        save_log("GET Languages : status_code=200")
        return languages
    else:
        save_log("GET Languages : status_code=500")
        raise HTTPException(status_code=500, detail="An error occurred")


@router.get("/genres")
def get_genres():
    response = requests.get(DB_URL + "/genre/list")
    if response.status_code == 200:
        genres = response.json()
        save_log("GET Genres : status_code=200")
        return genres
    else:
        save_log("GET Genres : status_code=500")
        raise HTTPException(status_code=500, detail="An error occurred")
