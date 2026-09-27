# リバーシ v3 デプロイ手順（GIT版）

本ドキュメントは、**リバーシ v3**（`reversi.docker.3`）を本番サーバーへ **GIT 経由でデプロイ**するための手順をまとめたものです。

---

## 1. 概要

- **クライアント**: Vue 3 + Vite + Vuetify（静的ファイルをビルドし、nginx が直接配信）
- **バックエンド**: Node.js + Socket.IO（ポート 4100）
- **構成**: nginx（443）+ docker-compose（server 常駐 / client ワンショットビルド）
- **自動起動**: systemd ユニット（`reversi-server.service`）
- **デプロイ方式**: GIT リポジトリをサーバー上で pull → コピー → ビルド

```
ブラウザ
   │  https://reversi.hoge9.xyz
   ▼
nginx (443)
   ├─ /            → reversi.client/dist（静的ファイル）
   └─ /socket.io/  → proxy → localhost:4100（Socket.IO サーバー）
```

---

## 2. 前提条件（サーバー環境）

| 項目 | 値 |
|------|----|
| ドメイン | `reversi.hoge9.xyz` |
| デプロイ先 | `/var/www/html/vhosts/hoge9.xyz/reversi.docker` |
| GIT リポジトリ | `docker-reversi.3`（サーバー上のローカルリポジトリ） |
| Docker Compose | `docker-compose`（v1.29.2 / `docker compose` ではなくハイフン形式） |
| Socket.IO ポート | 4100 |
| nginx 設定 | `/etc/nginx/sites-available/reversi.hoge9.xyz.conf` |
| systemd ユニット | `/etc/systemd/system/reversi-server.service` |

> 本番では `docker-compose`（v1 系）を使用します。`docker compose`（v2 系）とはコマンド名が異なる点に注意してください。

---

## 3. ローカルでのビルド確認（任意）

デプロイ前に、クライアントのビルドが通ることを確認します。

```bash
cd reversi.client
npm install
npm run build      # vite build（dist/ が生成される）
```

成功すれば `dist/` が生成されます。サーバー側も同様に確認できます。

```bash
cd reversi.server
npm install
npm run build      # tsc（config/default.ts → default.js も再生成）
```

> ローカルでの動作確認は、クライアントは Vite（3000）、サーバーは 4100 で起動します。
> クライアントは `VITE_SOCKET_URL` 未設定時は同一オリジン接続（nginx の `/socket.io/` プロキシ経由）になります。

---

## 4. GIT リポジトリへの反映（ローカル）

ローカルで修正した内容を GIT リポジトリにコミットし、リモートへ push します。

```bash
cd reversi.docker.3
git add .
git commit -m "変更内容の説明"
git push origin <ブランチ名>
```

> `node_modules` / `dist` / `.git` などは `.gitignore` で除外されていることを確認してください。
> 除外されていない場合は、リポジトリが肥大化するため `.gitignore` に追記してください。

---

## 5. サーバー上での展開・配置

### 5-1. `deploy-from-git.sh` を使う場合（推奨）

サーバー上の GIT リポジトリ（`docker-reversi.3`）の**親ディレクトリ**で実行します。

```bash
sudo bash deploy-from-git.sh
```

`deploy-from-git.sh` は以下を自動実行します。

1. GIT PULL（`git pull origin`）
2. 既存ディレクトリを `reversi.docker.bak.<日時>` に退避
3. GIT リポジトリを `/var/www/html/vhosts/hoge9.xyz/reversi.docker` へコピー（`.git` は除外）
4. `docker-compose down`
5. サーバービルド（`docker-compose up -d --build server`）
6. クライアントビルド（`docker-compose up --build client`）

### 5-2. 手動で行う場合

```bash
# 1. GIT リポジトリへ移動して pull
cd docker-reversi.3
git pull origin
cd ..

# 2. 既存を退避
sudo mv /var/www/html/vhosts/hoge9.xyz/reversi.docker \
        /var/www/html/vhosts/hoge9.xyz/reversi.docker.bak.$(date +%Y%m%d_%H%M%S)

# 3. GIT リポジトリを配置（.git は除外）
cp -r docker-reversi.3 /var/www/html/vhosts/hoge9.xyz/reversi.docker
rm -rf /var/www/html/vhosts/hoge9.xyz/reversi.docker/.git

# 4. コンテナ停止 → ビルド
cd /var/www/html/vhosts/hoge9.xyz/reversi.docker
docker-compose down
docker-compose up -d --build server
docker-compose up --build client
```

---

## 6. systemd 自動起動の設定（初回のみ）

サーバー起動時に Socket.IO サーバーが自動起動するよう設定します。

```bash
sudo cp reversi-server.service /etc/systemd/system/reversi-server.service
sudo systemctl daemon-reload
sudo systemctl enable --now reversi-server.service
```

状態確認:

```bash
sudo systemctl status reversi-server.service
docker-compose ps
```

---

## 7. 動作確認

1. ブラウザで `https://reversi.hoge9.xyz` を開く。
2. 初回のルーム選択ポップアップが表示され、ルームを選択できること。
3. ハンバーガーメニューから「エントリー」で名前を入力し、エントリー一覧に表示されること。
4. 2 人以上で対戦が開始されること（先頭＝白、2 番目＝黒）。
5. 開発者ツールのネットワークタブで `/socket.io/...` が 200 OK であること。

---

## 8. 既知の警告（npm warn / npm notice）

`npm install` 実行時に以下の警告・通知が表示されますが、**いずれもエラーではなく、本番動作には影響しません**。

### 8-1. `unplugin-vue-router@0.12.0`（deprecated）

```
npm warn deprecated unplugin-vue-router@0.12.0: Merged into vuejs/router. Migrate: https://router.vuejs.org/guide/migration/v4-to-v5.html
```

- **用途**: ファイルベースルーティング（`src/pages/` からルート自動生成）。
- **内容**: `vuejs/router`（v5）に統合されたため非推奨。
- **影響**: 開発時のみ。本番ビルド・ランタイムには影響なし。
- **対処**: 現状のまま運用可。v5 への移行はルーティング設定の書き換えを伴うため、必要になった時点で検討。

### 8-2. `eslint@9.39.5`（no longer supported）

```
npm warn deprecated eslint@9.39.5: This version is no longer supported. Please see https://eslint.org/version-support for other options.
```

- **用途**: 開発時のコード検証（lint）のみ。
- **影響**: 本番には一切影響なし。
- **対処**: 現状のまま運用可。アップグレード時は `eslint-config-vuetify` との互換性確認が必要。

### 8-3. npm の新バージョン通知

```
npm notice New major version of npm available! 10.9.8 -> 12.0.2
```

- **内容**: npm 自体の更新案内。
- **対処**: 無視して OK。サーバー環境の npm を勝手に更新しないこと。

> インストール自体は正常終了します（`found 0 vulnerabilities`）。上記警告が表示されてもデプロイは継続して問題ありません。

---

## 9. ロールバック手順

問題が発生した場合は、退避したバックアップへ戻します。

```bash
cd /var/www/html/vhosts/hoge9.xyz
docker-compose -f reversi.docker/docker-compose.yml down 2>/dev/null || true

# 現在のディレクトリを退避（任意）
sudo mv reversi.docker reversi.docker.ng.$(date +%Y%m%d_%H%M%S)

# バックアップを元に戻す
sudo mv reversi.docker.bak.<日時> reversi.docker

# 再ビルド
cd reversi.docker
docker-compose up -d --build server
docker-compose up --build client
```

> GIT 経由の場合は、`git revert` や `git checkout <コミット>` で特定のコミットへ戻してから `deploy-from-git.sh` を再実行する方法もあります。

---

## 10. トラブルシューティング

| 状況 | 原因と対策 |
|------|------------|
| ルーム一覧に「ルームがありません」と表示される | サーバーが旧コードのまま。`docker-compose up -d --build server` でサーバーを再ビルド・再起動する。 |
| `/socket.io/` が接続できない | nginx の `location /socket.io/` のプロキシ設定、およびサーバー（4100）の起動状態を確認。 |
| クライアントの変更が反映されない | `docker-compose up --build client` を再実行して dist を再生成する。 |
| `docker compose` でエラー | 本番は v1 系の `docker-compose`（ハイフン形式）を使用する。 |
| `git pull` でエラー（コンフリクト等） | サーバー上のリポジトリで `git status` を確認し、ローカル変更があれば `git checkout .` で破棄してから pull する。 |

---

以上で、リバーシ v3 のデプロイが完了します。
