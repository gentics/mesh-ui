FROM node:9-alpine

ARG USER_NAME="jenkins"

RUN apk add --update \
    sed openjdk8 git \
  && rm -rf /var/cache/apk/*

# Add user
# The ID / GID 10000 is used by the jenkinsci/slave Dockerfile and has to match here, because Jenkins
# does the SCM checkout in the jnlp container for some reasons.
RUN adduser -D -u 10000 -h /ci ${USER_NAME}
RUN id ${USER_NAME}
RUN chown ${USER_NAME}: /usr/local -R
USER ${USER_NAME}

RUN mkdir -p /ci/.m2 && mkdir -p /ci/workspace
RUN ln -s /ci/credentials/maven/settings.xml /ci/.m2/settings.xml
