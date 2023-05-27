FROM node:18-alpine3.17 as base
EXPOSE 8080
ENV NODE_ENV=production
WORKDIR /app
RUN apk add tini --no-cache
COPY package*.json ./ 
RUN npm config list \
    && npm ci \ 
    && npm cache clean --force
ENV PATH /app/node_modules/.bin:$PATH
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "./server.js"]

FROM base as dev
ENV NODE_ENV=development
RUN npm config list \
    && npm install --only=development \
    && npm cache clean --force
COPY . .
USER node
CMD ["nodemon", "./server.js"]

FROM dev as pre-prod
USER root
RUN rm -rf ./data \
    && rm -rf ./node_modules

FROM base as prod
COPY --from=pre-prod /app /app
HEALTHCHECK CMD curl http://127.0.0.1:8080/ || exit 1
USER node