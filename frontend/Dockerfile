FROM node:16-alpine3.13

ENV VUE_APP_TODO_SERVER_URL='http://localhost:4000'
ENV VUE_APP_TODO_CLIENT_URL='http://localhost:8080'

WORKDIR /app

COPY . .

EXPOSE 8080

RUN npm install \
    && npm ls \
    && npm cache clean --force

CMD ["npm","run","serve"]