FROM node:14.16.1-alpine
WORKDIR /usr/showrunner/client
COPY package*.json yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 3000
ENV SERVER_URL "http://localhost:3001"
CMD yarn start