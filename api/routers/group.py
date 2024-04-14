import collections
from collections import Counter

from fastapi import HTTPException, APIRouter
import requests
from fastapi.params import Depends
from pydantic import BaseModel

from api.vars import DB_URL
from api.routers.log import save_log
from api.routers.infos import get_genres, transform_to_user, verify_token, transform_to_movie, verify_lang

router = APIRouter()


class Group(BaseModel):
    groupName: str


@router.get("/groups")
def get_groups():
    response = requests.get(DB_URL + "/group/list")
    if response.status_code == 200:
        save_log("GET Groups : status_code=200")
        return response.json()
    else:
        save_log("GET Groups : status_code=500")
        raise HTTPException(status_code=500, detail="An error occurred")


@router.get("/group/infos/{groupName}")
def get_group_by_id(groupName: str):
    response = requests.get(DB_URL + "/group/", params={"groupName": groupName})
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
        most_common_genres = collections.Counter(genres_counter).most_common(3)
        preferenceGenres = []
        for info in most_common_genres:
            preferenceGenres.append({"name": genre.get(int(info[0]), ""), "freq": info[1]})

        save_log("GET Group {groupName: " + groupName + "} : status_code=200")
        return {"groupName": groupName, "members": result, "preferenceGenres": preferenceGenres}
    elif response.status_code == 404:
        save_log("GET Group {groupName: " + groupName + "} : status_code=404")
        raise HTTPException(status_code=404, detail="Group not found")
    else:
        save_log("GET Group {groupName: " + groupName + "} : status_code=500")
        raise HTTPException(status_code=500, detail="An error occurred")


@router.post("/group/join")
def join_group(group: Group, token_payload: dict = Depends(verify_token)):
    if len(group.groupName) != "":
        save_log("POST Create Group {groupName: " + group.groupName + "} : status_code=409",
                 token_payload.get("userId"))
        raise HTTPException(status_code=406, detail="GroupName empty")
    response = requests.post(DB_URL + "/group/join",
                             json={"userId": token_payload.get("userId"), "groupName": group.groupName})
    if response.status_code == 200:
        token = response.json()
        save_log("POST Join Group {groupName: " + group.groupName + "} : status_code=200", token_payload.get("userId"))
        return token
    else:
        save_log("POST Join Group {groupName: " + group.groupName + "} : status_code=500", token_payload.get("userId"))
        raise HTTPException(status_code=500, detail="An error occurred")


@router.post("/group/leave")
def leave_group(group: Group, token_payload: dict = Depends(verify_token)):
    response = requests.post(DB_URL + "/group/leave",
                             json={"userId": token_payload.get("userId"), "groupName": group.groupName})
    if response.status_code == 200:
        token = response.json()
        save_log("POST Leave Group {groupName: " + group.groupName + "} : status_code=200", token_payload.get("userId"))
        return token
    else:
        save_log("POST Leave Group {groupName: " + group.groupName + "} : status_code=500", token_payload.get("userId"))
        raise HTTPException(status_code=500, detail="An error occurred")


@router.get("/group/recommendation")
def get_group_recommendation(language: str, groupName: str, onMoviesSeen: bool,
                             token_payload: dict = Depends(verify_token)):
    if not (verify_lang(language)):
        save_log("GET Recommendation {groupName: " + groupName + ", onMoviesSeen: " + str(
            onMoviesSeen) + ", language: " + language + "} : status_code=404", token_payload.get("userId"))
        raise HTTPException(status_code=404, detail="Language not found")
    response = requests.get(DB_URL + "/group/", params={"groupName": groupName})
    if response.status_code == 200:
        members = response.json()
        if not (any(member['userId'] == token_payload.get("userId") for member in members)):
            save_log("GET Recommendation {groupName: " + groupName + ", onMoviesSeen: " + str(
                onMoviesSeen) + ", language: " + language + "} : status_code=401", token_payload.get("userId"))
            raise HTTPException(status_code=401, detail="Not a member")

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

        if movies_seen and onMoviesSeen:
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
        save_log("GET Recommendation {groupName: " + groupName + ", onMoviesSeen: " + str(
            onMoviesSeen) + ", language: " + language + "} : status_code=200", token_payload.get("userId"))
        return result_reco[:10]

    elif response.status_code == 404:
        save_log("GET Recommendation {groupName: " + groupName + ", onMoviesSeen: " + str(
            onMoviesSeen) + ", language: " + language + "} : status_code=404", token_payload.get("userId"))
        raise HTTPException(status_code=404, detail="Group not found")
    else:
        save_log("GET Recommendation {groupName: " + groupName + ", onMoviesSeen: " + str(
            onMoviesSeen) + ", language: " + language + "} : status_code=500", token_payload.get("userId"))
        raise HTTPException(status_code=500, detail="An error occurred")


def recommendation_with_movie(most_seen_movies: list, language: str, movies_seen: set, recommended_movie_ids: set,
                              recommendations: list, most_common_genre_ids: list):
    if not (verify_lang(language)):
        save_log("GET Recommendation {language: " + language + "} : status_code=404")
        raise HTTPException(status_code=404, detail="Language not found")
    for movie_id, _ in most_seen_movies:
        response = requests.post(DB_URL + "/movie/recommendation/",
                                 json={"movie_id": movie_id, "language": language, "page": 1})
        print(response.json())
        if response.status_code == 200 or response.status_code == 201:
            data = response.json()
            for movie in data:
                if (movie['id'] not in movies_seen and movie['id'] not in recommended_movie_ids
                        and any(genre_id in movie['genre_ids'] for genre_id in most_common_genre_ids)):
                    recommendations.append(movie)
                    recommended_movie_ids.add(movie['id'])
    return recommendations, recommended_movie_ids


def recommendation_without_movie(language: str, movies_seen: set, recommended_movie_ids: set,
                                 recommendations: list, most_common_genre_ids: list):
    if not (verify_lang(language)):
        save_log("GET Recommendation {language: " + language + "} : status_code=404")
        raise HTTPException(status_code=404, detail="Language not found")
    for genre in most_common_genre_ids:

        response = requests.post(DB_URL + "/movie/discover/",
                                 json={"with_genres": genre, "language": language})
        if response.status_code == 200 or response.status_code == 201:
            data = response.json()
            for movie in data:
                if movie['id'] not in movies_seen and movie['id'] not in recommended_movie_ids:
                    recommendations.append(movie)
                    recommended_movie_ids.add(movie['id'])
    return recommendations, recommended_movie_ids


@router.post("/group/create")
def create_group(group: Group, token_payload: dict = Depends(verify_token)):
    if len(group.groupName) != "":
        save_log("POST Create Group {groupName: " + group.groupName + "} : status_code=409",
                 token_payload.get("userId"))
        raise HTTPException(status_code=406, detail="GroupName empty")
    response = requests.post(DB_URL + "/group/create",
                             json={"userId": token_payload.get("userId"), "groupName": group.groupName})
    if response.status_code == 200:
        token = response.json()
        save_log("POST Create Group {groupName: " + group.groupName + "} : status_code=200",
                 token_payload.get("userId"))
        return {"userId": token_payload.get("userId"), "token": token}
    elif response.status_code == 409:
        save_log("POST Create Group {groupName: " + group.groupName + "} : status_code=409",
                 token_payload.get("userId"))
        raise HTTPException(status_code=409, detail="Group already exists")
    else:
        save_log("POST Create Group {groupName: " + group.groupName + "} : status_code=500",
                 token_payload.get("userId"))
        raise HTTPException(status_code=500, detail="An error occurred")
