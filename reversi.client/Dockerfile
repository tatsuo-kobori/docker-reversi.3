FROM node:22-bullseye

ARG SOCKET_URL

ENV PUBLIC_URL=http://153.122.11.234:3000
ENV VITE_SOCKET_URL=$SOCKET_URL

WORKDIR /app/reversi.client
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
#CMD ["npm", "run", "dev", "--", "--host"]

