"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = __importStar(require("http"));
const socketio = __importStar(require("socket.io"));
const socket_1 = __importDefault(require("./socket"));
const config = require("config");
const port = config.get("port");
const host = config.get("host");
const corsOrigin = config.get("corsOrigin");
const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server, {
    cors: {
        origin: corsOrigin,
        credentials: true
    },
});
app.get('/', (_, res) => {
    res.status(200).send(`Realtime server for 'Reversi' by team Pocket`);
});
server.listen(port, host, () => {
    // server.listen(port, () =>{
    console.log(`The Realtime server for 'Reversi' has started`);
    console.log(config.get("corsOrigin"));
    console.log(`[http://${host}/${port}]`);
    (0, socket_1.default)({ io });
});
