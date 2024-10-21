FROM node:22-bookworm AS builder

EXPOSE 5173

ENV APP_HOME=/usr/src/app \
  LANG=C.UTF-8 \
  PATH="${PATH}:/usr/src/app/node_modules/.bin"

WORKDIR $APP_HOME

COPY ./package-lock.json ./package-lock.json
COPY ./package.json ./package.json

RUN npm install

COPY ./public ./public
COPY ./src ./src
COPY ./.eslintrc.cjs ./.eslintrc.cjs
COPY ./index.html ./index.html
COPY ./tsconfig.json ./tsconfig.json
COPY ./tsconfig.node.json ./tsconfig.node.json
COPY ./vite.config.ts ./vite.config.ts

CMD ["npm", "run", "dev"]