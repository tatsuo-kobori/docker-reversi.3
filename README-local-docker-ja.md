# ローカル Docker で Reversi を動かす手順

## 概要
本ドキュメントは、Windows 10 上で **Reversi**（Vue/Vite フロントエンド + Node/Socket.IO バックエンド）を Docker でローカル起動するための設定と手順をまとめたものです。

---

## 前提条件
- **Docker Desktop** がインストールされ、実行中であること。<br>
- ターミナルから `docker` と `docker compose` コマンドが利用できること。<br>
- （任意）VS Code 等のエディタを用意しておくと編集が楽です。

---

## ディレクトリ構成（例）
```
C:/Users/tat/Documents/develop/reversi.docker/
├─ docker-compose.yml
├─ reversi.server/   # Node + Socket.IO サーバー
│  ├─ Dockerfile
│  └─ config/default.ts
└─ reversi.client/   # Vue/Vite フロントエンド
   ├─ Dockerfile
   └─ .env (任意)
```

---

## docker-compose.yml（設定）
```yaml
# docker-compose.yml
version: '3.9'
services:
  server:
    build:
      context: ./reversi.server
      dockerfile: Dockerfile
    image: reversi/server
    container_name: reversi-server
    ports:
      - "4100:4100"          # ホスト側で 4100 番を公開（サーバー）
    environment:
      NODE_ENV: production
    networks:
      - reversi-net

  client:
    build:
      context: ./reversi.client
      dockerfile: Dockerfile
    image: reversi/client
    container_name: reversi-client
    ports:
      - "4000:3000"          # ホスト側 4000 番 → コンテナ内 3000 番（Vite dev サーバ）
    depends_on:
      - server
    environment:
      SOCKET_URL: http://host.docker.internal:4100   # Socket.IO エンドポイント
    networks:
      - reversi-net

networks:
  reversi-net:
```

### ポートマッピングの理由
- `4000:3000` にすることで、Docker Desktop が既に占有しているポート 3000 を回避。<br>
- コンテナ内では Vite dev サーバが **3000** 番で動作し、ホスト側は **4000** 番でアクセス可能になる。

---

## client/Dockerfile（フロントエンド）
```dockerfile
FROM node:22-bullseye
ARG SOCKET_URL
ENV VITE_SOCKET_URL=$SOCKET_URL          # Vite へ環境変数を注入
WORKDIR /app/reversi.client
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]   # コンテナ内全インターフェースで dev サーバを起動
```

---

## server/config/default.ts（サーバー設定）
```ts
export default {
    corsOrigin: "http://reversi.hoge9.xyz",  // 本番用の公開ドメイン
    port: 4100,
    host: "0.0.0.0",
    timeout: 10 * 1000,
};
```
*(ローカルテスト時は `corsOrigin` を `http://localhost:3000` にしても構いません。)*

---

## ビルド & 起動手順
```bash
# コンテナのビルドと起動（初回は --build が必要）
docker compose up --build
```

### アクセス先
- フロントエンド: <http://localhost:4000>
- Socket.IO サーバー: <http://localhost:4100> （内部通信）

---

## 動作確認
1. ブラウザで `http://localhost:4000` を開く。<br>
2. 開発者ツール → コンソールに「User connected …」といったログが出ているか確認。<br>
3. ネットワークタブで `/socket.io/...` のステータスが 200 OK になっていることを確認。

---

## よくあるトラブルシューティング
| 状況 | 原因と対策 |
|------|------------|
| `localhost:4000` が開かない | Windows のファイアウォールがポート 4000 をブロックしている可能性。<br>→ ファイアウォールで例外を追加する。 |
| コンテナ起動時にエラー | Docker Desktop が 4100 番を既に使用中の場合は、`docker compose down && docker compose up --build` を実行し再起動してみる。 |
| Socket.IO 接続失敗 | `SOCKET_URL` の値が正しく設定されているか確認（`http://host.docker.internal:4100`）。 |

---

## 参考リンク
- [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/) – Docker を Windows で使う際の公式ドキュメント。
- [Vite Docs](https://vitejs.dev/) – Vite の設定やデバッグ方法。
- [Socket.IO Docs](https://socket.io/docs/v4/) – Socket.IO の CORS 設定など。

---

以上で、ローカル Docker 環境から Reversi アプリを起動し、ブラウザからアクセスできるようになります。ご不明点があればいつでもどうぞ！