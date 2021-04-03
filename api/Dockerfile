FROM node:lts-alpine3.13
WORKDIR /api
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]