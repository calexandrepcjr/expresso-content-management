FROM node:22-alpine as dev

ENV USER=appuser
ENV USERGROUP=appgroup
ENV HOME=/home/${USER}
ENV NPM_FOLDER=.npm-packages

# ROOTLESS IMAGE
RUN deluser --remove-home node \
  && addgroup -S ${USERGROUP} -g 1000 \
  && adduser -S -G ${USERGROUP} -u 1000 ${USER}

USER ${USER}

WORKDIR ${HOME}/app

# NPM GLOBAL WITHOUT ROOT
ENV NPM_CONFIG_PREFIX=${HOME}/${NPM_FOLDER}
ENV PATH=$PATH:${HOME}/${NPM_FOLDER}/bin

RUN mkdir -p ~/${NPM_FOLDER}/bin
RUN npm config set prefix '${HOME}/${NPM_FOLDER}/'
RUN export NODE_PATH=${HOME}/${NPM_FOLDER}

COPY --chown=${USER}:${USERGROUP} package*.json .
COPY --chown=${USER}:${USERGROUP} tsconfig*.json .
RUN npm ci --loglevel=error

EXPOSE 3000

CMD ["npm", "run", "dev"]
