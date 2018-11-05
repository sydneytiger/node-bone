FROM node:8

WORKDIR /app

COPY . .

EXPOSE 3000

RUN rm -rf node_modules/ && npm install

CMD [ "npm", "start" ]