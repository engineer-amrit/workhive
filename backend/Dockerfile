FROM node:23-alpine3.20 AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:23-alpine3.20

WORKDIR /app

COPY --from=build /app/dist ./
COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./

RUN yarn install --production

EXPOSE 3000

CMD [ "node", "index.js" ]

