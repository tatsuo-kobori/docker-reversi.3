// Socket.IO サーバーの接続先。
// ビルド時に Vite の環境変数 VITE_SOCKET_URL から解決される。
//   - 開発時: .env.development（npm run dev）
//   - 本番時: .env.production（npm run build）
// 未設定の場合は undefined となり、socket.io-client は
// 同一オリジン（リバースプロキシ経由）へ接続する。
export const SOCKET_URL: string | undefined = import.meta.env.VITE_SOCKET_URL;
