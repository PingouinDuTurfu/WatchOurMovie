FROM node:latest

CMD ["mkdir", "/log"]
WORKDIR /log

COPY log/package.json ./
RUN npm install

COPY /log/ .

CMD ["node", "app.js"]