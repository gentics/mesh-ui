FROM node:9-alpine

RUN apk add --update \
    sed \
  && rm -rf /var/cache/apk/*

RUN mkdir /root/.m2
RUN ln -s /root/credentials/maven/settings.xml /root/.m2/settings.xml
