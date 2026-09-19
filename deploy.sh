#!/bin/bash
# ============================================================
# Reversi デプロイスクリプト
#
# サーバー上で実行する。TAR を展開 → 所定ディレクトリへ移動 →
# コンテナ停止 → サーバー/クライアントビルド までを自動化する。
#
# 使い方（TAR とこのスクリプトを同じディレクトリに置いて実行）:
#   sudo bash deploy.sh [TARファイル]
#   （TARファイルを省略した場合は reversi.docker.3.tar.gz を使用）
# ============================================================
set -euo pipefail

# ---- 設定 ----
TAR_FILE="${1:-reversi.docker.3.tar.gz}"                       # 展開する TAR（カレントディレクトリ）
EXTRACTED_DIR="reversi.docker.3"                               # TAR 内のトップレベルフォルダ名
APP_DIR="/var/www/html/vhosts/hoge9.xyz/reversi.docker"        # デプロイ先
BACKUP_DIR="/var/www/html/vhosts/hoge9.xyz/reversi.docker.bak.$(date +%Y%m%d_%H%M%S)"

echo "===== 1/6 TAR 展開 ====="
if [ ! -f "${TAR_FILE}" ]; then
  echo "エラー: ${TAR_FILE} が見つかりません。"
  exit 1
fi
tar -xzf "${TAR_FILE}"

echo "===== 2/6 既存ディレクトリを退避 ====="
if [ -d "${APP_DIR}" ]; then
  mv "${APP_DIR}" "${BACKUP_DIR}"
  echo "退避しました: ${BACKUP_DIR}"
else
  echo "既存ディレクトリなし（初回デプロイ）"
fi

echo "===== 3/6 展開したフォルダを所定のディレクトリへ移動 ====="
if [ ! -d "${EXTRACTED_DIR}" ]; then
  echo "エラー: ${EXTRACTED_DIR} が見つかりません（TAR 内のフォルダ名を確認してください）。"
  exit 1
fi
mv "${EXTRACTED_DIR}" "${APP_DIR}"

echo "===== 4/6 コンテナ停止 ====="
cd "${APP_DIR}"
docker-compose down

echo "===== 5/6 サーバービルド ====="
docker-compose up -d --build server

echo "===== 6/6 クライアントビルド ====="
docker-compose up --build client

echo "===== 完了 ====="
docker-compose ps
