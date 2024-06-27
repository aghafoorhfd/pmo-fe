##Old Configuration by fayyaz
#FROM node:16-alpine AS builder
#WORKDIR /app
#COPY . .
#RUN npm install
#RUN npm run-script build
#FROM nginx:alpine
#WORKDIR /usr/share/nginx/html
#RUN rm -rf ./*
#COPY --from=builder /app/build .
#ENTRYPOINT ["nginx", "-g", "daemon off;"]

## Skipping Builder section of old configuration due to build issues inside container
FROM nginx:alpine
ENV TZ=Asia/Karachi
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY ./build/ .
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["nginx", "-g", "daemon off;"]

##By Talal
#FROM node:16-alpine
#WORKDIR /app
#COPY . . 
#ENV NODE_ENV production
#WORKDIR /app
#EXPOSE 3000
## Start the app
#CMD ["npm", "start"]
