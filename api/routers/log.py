import requests

from api.vars import LOG_URL


def save_log(msg: str, userId: str = "null"):
    requests.post(LOG_URL + "/log/add", json={"userId": userId, "data": msg})
