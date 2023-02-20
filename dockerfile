FROM node:18

WORKDIR /home directory/user/your app

COPY package*.json ./

RUN npm install

EXPOSE 4000

COPY . .


CMD [ "node", "./tg_bot/main.mjs" ]
