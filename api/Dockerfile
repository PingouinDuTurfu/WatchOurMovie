FROM tiangolo/uvicorn-gunicorn-fastapi:python3.10

CMD ["mkdir", "/app/api"]

WORKDIR /app/api

COPY ./api/ /app/api

RUN pip install --upgrade pip && pip install -r requirements.txt


CMD ["python", "main.py"]