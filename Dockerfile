FROM node:14.10.0-alpine3.10
ARG ENV=local
ENV e=${ENV}
WORKDIR /api
ADD package.json .
ADD package-lock.json .
RUN npm install
RUN npm install nodemon -g
EXPOSE 8000
ADD . .
CMD npm i && npm run ${e}
