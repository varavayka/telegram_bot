FROM node:18

WORKDIR /home/kka/app_tg

COPY package*.json ./

RUN npm install

EXPOSE 4000

COPY . .


CMD [ "node", "./tg_bot/main.mjs" ]
