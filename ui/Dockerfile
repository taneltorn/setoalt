FROM node:20 as build

ARG VITE_API_URL
ARG VITE_ENVIRONMENT

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx:stable-alpine as production

COPY --from=build /app/dist /usr/share/nginx/html

COPY --from=root nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]