FROM node:lts-alpine3.13
WORKDIR /client
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start"]