FROM node:14.5-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run prod

FROM nginx:1.17.1-alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/tatakae-client /usr/share/nginx/html
