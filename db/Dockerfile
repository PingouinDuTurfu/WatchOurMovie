FROM node:latest

CMD ["mkdir", "/app"]
WORKDIR /app

COPY db/package.json ./
RUN npm install

COPY /db/ .

CMD ["node", "app.js"]