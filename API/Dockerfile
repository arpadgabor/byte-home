FROM node:12.15-alpine as build

WORKDIR /app
COPY API/ ./

RUN echo "unsafe-perm = true" >> ~/.npmrc

RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm install \
    && apk del build-dependencies
RUN npm install -g node-gyp
RUN npm install

RUN npm install pm2 -g
RUN npm link pm2

EXPOSE 3000

CMD ["pm2-runtime", "index.js"]