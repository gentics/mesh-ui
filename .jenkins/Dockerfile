FROM node:9-alpine

RUN apk add --update \
    sed \
  && rm -rf /var/cache/apk/*

RUN mkdir -p ~/.m2 && mkdir -p ~/workspace
RUN ln -s ~/credentials/maven/settings.xml ~/.m2/settings.xml
