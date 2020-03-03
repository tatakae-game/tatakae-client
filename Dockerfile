FROM node:12

WORKDIR /app/client

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json .
RUN npm i

COPY . .

EXPOSE 4200
CMD npm start -- --host 0.0.0.0
