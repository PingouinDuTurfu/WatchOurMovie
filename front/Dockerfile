FROM node:latest

CMD ["mkdir", "/front"]
WORKDIR /front

COPY front/wom/package.json ./
RUN npm install

COPY /front/wom .

CMD ["npm", "start"]