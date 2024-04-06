FROM alpine:3.19

WORKDIR /app

COPY . /app

RUN npm install

ENV PORT=3001

CMD ["npm", "start"]