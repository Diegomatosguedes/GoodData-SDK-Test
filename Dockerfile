FROM node:18.20.4-slim AS build
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN npm install
RUN npm run build-angular

FROM nginx:latest AS final
WORKDIR /app
COPY --from=build /app/dist/TOTVS-Carol-Analytics-FrontEnd/site /usr/share/nginx/html
EXPOSE 80