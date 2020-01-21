FROM node:13-alpine

ARG USER_NAME="jenkins"

RUN apk add --no-cache \
    sed \
    openjdk8 \
    git \
    openssh \
    docker \
    # Chrome headless
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV CHROME_BIN /usr/bin/chromium-browser

# Add user
# The ID / GID 10000 is used by the jenkinsci/slave Dockerfile and has to match here, because Jenkins
# does the SCM checkout in the jnlp container for some reasons.
RUN adduser -D -u 10000 -h /ci ${USER_NAME} \
    && mkdir -p /home/${USER_NAME}/Downloads /app \
    && chown -R ${USER_NAME}:${USER_NAME} /app

# Setup Git / SSH
ADD ./files/.gitconfig /ci/.gitconfig
ADD ./files/config /ci/.ssh/config
RUN ssh-keyscan github.com >> /ci/.ssh/known_hosts
RUN ssh-keyscan git.gentics.com >> /ci/.ssh/known_hosts

RUN chown ${USER_NAME}: /ci -R
RUN chown ${USER_NAME}: /usr/local -R

USER ${USER_NAME}

RUN mkdir -p /ci/.m2 && mkdir -p /ci/workspace
RUN ln -s /ci/credentials/maven/settings.xml /ci/.m2/settings.xml
