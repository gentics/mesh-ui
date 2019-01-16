FROM node:9-alpine

ARG USER_NAME="jenkins"

RUN apk add --update \
    sed \
  && rm -rf /var/cache/apk/*

# Add user
# The ID / GID 10000 is used by the jenkinsci/slave Dockerfile and has to match here, because Jenkins
# does the SCM checkout in the jnlp container for some reasons.
RUN adduser -D -u 10000 -h /ci ${USER_NAME}
RUN id ${USER_NAME}

USER ${USER_NAME}

RUN mkdir -p ~/.m2 && mkdir -p ~/workspace
RUN ln -s ~/credentials/maven/settings.xml ~/.m2/settings.xml
