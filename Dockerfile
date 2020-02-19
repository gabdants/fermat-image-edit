
### STAGE 1: Build ###
FROM node:12.7-alpine AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm uninstall -g jspdf
RUN npm i -g jspdf
RUN npm install
COPY . .
RUN npm run build
COPY Staticfile dist/
### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/petlandmkt /usr/share/nginx/html
