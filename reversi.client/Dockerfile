FROM node:22-bullseye

WORKDIR /app/reversi.client
COPY . .
RUN npm install

# ビルドは docker compose up 時に、bind mount したホストの dist へ出力される。
# （nginx がホストの reversi.client/dist を直接配信するため）
CMD ["npm", "run", "build"]
