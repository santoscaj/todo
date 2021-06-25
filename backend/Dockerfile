FROM node:16-alpine3.13

WORKDIR /app

COPY . .

EXPOSE 3000

RUN apk --update --no-cache add curl \
    && npm install \
    && npm ls  \
    && npm cache clean --force

HEALTHCHECK --interval=5m --timeout=30s --start-period=30s CMD curl --fail localhost:3000/users || exit

CMD ["npm","start"]