"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
exports.default = (0, envalid_1.cleanEnv)(process.env, {
    MONGO_URI: (0, envalid_1.str)(),
    PORT: (0, envalid_1.port)(),
    JWT_SECRET: (0, envalid_1.str)(),
    REDIS_HOST: (0, envalid_1.str)(),
    REDIS_PORT: (0, envalid_1.port)(),
    REDIS_PASSWORD: (0, envalid_1.str)(),
});
