"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateEnvs_1 = __importDefault(require("./validateEnvs"));
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, validateEnvs_1.default.JWT_SECRET, { expiresIn: "1d" });
};
exports.createToken = createToken;
