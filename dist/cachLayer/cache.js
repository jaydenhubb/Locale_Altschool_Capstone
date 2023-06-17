"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const validateEnvs_1 = __importDefault(require("../utils/validateEnvs"));
const client = (0, redis_1.createClient)({
    password: validateEnvs_1.default.REDIS_PASSWORD,
    socket: {
        host: validateEnvs_1.default.REDIS_HOST,
        port: validateEnvs_1.default.REDIS_PORT
    }
});
client.on("connect", () => {
    console.log("redis client connected");
});
client.on('error', () => {
    console.log("error connecting");
    // client.disconnect()
});
exports.default = client;
