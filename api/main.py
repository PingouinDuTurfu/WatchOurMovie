import os

from fastapi import FastAPI
from api.routers import group, movie, auth, profile, infos
from api.vars import API_PORT

app = FastAPI()
app.include_router(auth.router)
app.include_router(group.router)
app.include_router(infos.router)
app.include_router(movie.router)
app.include_router(profile.router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=int(API_PORT))
