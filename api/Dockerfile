FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

ARG LOG_DIRECTORY
RUN mkdir -p ${LOG_DIRECTORY}

EXPOSE 3000

CMD ["sh", "-c", "node dist/app.js >> ${LOG_DIRECTORY}/app.log 2>&1"]
