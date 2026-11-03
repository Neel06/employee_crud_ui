
# Build Angular
FROM node:22-alpine AS build

WORKDIR /src

COPY employee-crud-ui/package*.json ./

RUN npm ci

COPY employee-crud-ui/ ./

RUN npm run build -- --configuration production

# Serve Angular with Nginx
FROM nginx:stable-alpine

COPY employee-crud-ui/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build \
    /src/dist/employee-crud-ui/browser/ \
    /usr/share/nginx/html/

EXPOSE 8080
