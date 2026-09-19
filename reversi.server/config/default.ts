export default {
    corsOrigin: ["http://localhost:3000", "https://reversi.hoge9.xyz"], // ローカル開発(Vite 3000)と本番の両方を許可
    port: 4100,
    host: "0.0.0.0",
    timeout: 10 * 1000,
    rooms: [
        { name: "ROOM 101", disabled: false },
        { name: "ROOM 102", disabled: false },
        { name: "ROOM 103", disabled: false },
    ],
};
