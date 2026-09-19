FROM node:18-bullseye
WORKDIR /app/reversi.server
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 4100
CMD ["npm", "start"]
