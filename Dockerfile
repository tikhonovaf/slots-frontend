FROM node:18-alpine as build

WORKDIR /app
COPY package.json .
RUN npm --force install
COPY . .
## Build
RUN ./node_modules/react-scripts/bin/react-scripts.js build


FROM nginx:alpine
ENV REACT_APP_API_URL="http://backrestapi:8081"
COPY ./nginx/default.conf.template /etc/nginx/templates/default.conf.template
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html
COPY public/env_config.js /usr/share/nginx/html/env_config.js
COPY js_env.sh /docker-entrypoint.d/
