FROM node:16-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 19000
EXPOSE 19001
EXPOSE 19006

CMD ["npm", "start"] 