FROM node:22-alpine

RUN mkdir -p /home/node/server/node_modules && chown -R node:node /home/node/server

WORKDIR /home/node/server

USER node

COPY --chown=node:node package*.json ./

RUN npm clean-install --verbose

COPY --chown=node:node . .
COPY --chown=node:node ./.env.sample ./.env
COPY --chown=node:node ./server/config/rit-cert.pem.sample ./server/config/rit-cert.pem
COPY --chown=node:node ./server/config/seniorproject-key.pem.sample ./server/config/seniorproject-key.pem

ENV NODE_ENV=development

RUN npm run reset-database

EXPOSE 3001

CMD [ "node", "main.js" ]
