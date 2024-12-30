FROM node:20 AS build

ARG VITE_API_URL
ARG VITE_ENVIRONMENT
ARG VITE_PUBLIC_URL

ENV NODE_OPTIONS=--max-old-space-size=1024

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM nginx:stable-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

COPY --from=root nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]