#!/bin/bash
# ============================================================
# Reversi デプロイスクリプト（GIT版）
#
# サーバー上で実行する。GIT リポジトリを pull → 所定ディレクトリへコピー →
# コンテナ停止 → サーバー/クライアントビルド までを自動化する。
#
# 使い方（GIT リポジトリの親ディレクトリで実行）:
#   sudo bash deploy-from-git.sh
# ============================================================
set -euo pipefail

# ---- 設定 ----
APP_DIR="/var/www/html/vhosts/hoge9.xyz/reversi.docker"        # デプロイ先
BACKUP_DIR="/var/www/html/vhosts/hoge9.xyz/reversi.docker.bak.$(date +%Y%m%d_%H%M%S)"
GIT_DIR="docker-reversi.3"                                     # GIT リポジトリのディレクトリ名

echo "===== 1/6 GIT PULL ====="
cd "${GIT_DIR}"
git pull origin
echo "GIT PULL 完了"
cd ..

echo "===== 2/6 既存ディレクトリを退避 ====="
if [ -d "${APP_DIR}" ]; then
  mv "${APP_DIR}" "${BACKUP_DIR}"
  echo "退避しました: ${BACKUP_DIR}"
else
  echo "既存ディレクトリなし（初回デプロイ）"
fi

echo "===== 3/6 GIT リポジトリを所定のディレクトリへコピー ====="
if [ ! -d "${GIT_DIR}" ]; then
  echo "エラー: ${GIT_DIR} が見つかりません（GIT リポジトリのディレクトリ名を確認してください）。"
  exit 1
fi
cp -r "${GIT_DIR}" "${APP_DIR}"
rm -rf "${APP_DIR}/.git"   # .git はデプロイ先に不要（ソース漏えい防止）

echo "===== 4/6 コンテナ停止 ====="
cd "${APP_DIR}"
docker-compose down

echo "===== 5/6 サーバービルド ====="
docker-compose up -d --build server

echo "===== 6/6 クライアントビルド ====="
docker-compose up --build client

echo "===== 完了 ====="
docker-compose ps
