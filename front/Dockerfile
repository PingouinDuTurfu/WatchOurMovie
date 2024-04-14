FROM node:latest

WORKDIR /front

COPY ./front/wom/package*.json ./

RUN npm install

EXPOSE 3003

COPY ./front/wom ./

CMD ["npm", "start"]