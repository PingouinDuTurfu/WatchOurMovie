FROM node:latest

CMD ["mkdir", "/app"]
WORKDIR /app

COPY auth/package.json ./
RUN npm install

COPY /auth/ .

CMD ["node", "app.js"]