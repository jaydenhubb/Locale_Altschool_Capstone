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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signUp = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const user_1 = __importDefault(require("../models/user"));
const util = __importStar(require("../utils"));
const generate_api_key_1 = __importDefault(require("generate-api-key"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // validate data
        if (!password || !email) {
            throw (0, http_errors_1.default)(400, 'Please provide email and password');
        }
        if (password.length < 6) {
            throw (0, http_errors_1.default)(400, 'Password must be at least 6 characters');
        }
        // check database if it exists
        const exists = yield user_1.default.findOne({ email }).exec();
        if (exists) {
            throw (0, http_errors_1.default)(400, 'Email already exists');
        }
        // create APIkey
        const apiKey = (0, generate_api_key_1.default)({
            method: "base32",
            dashes: false,
            prefix: "jay",
        });
        // create user
        const user = yield user_1.default.create({
            email,
            password,
            apiKey,
        });
        yield user.save();
        // create token
        const token = util.createToken(user._id);
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            sameSite: "none",
            secure: true,
        });
        if (user) {
            const { email } = user;
            res.status(201).json({ email, "key": apiKey });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw (0, http_errors_1.default)(400, "Email and Password are required");
        }
        const user = yield user_1.default.findOne({ email }).select("+password").select("+email").exec();
        if (!user) {
            throw (0, http_errors_1.default)(401, "Invalid Credentials");
        }
        const hashedPassword = user.password != undefined ? yield bcrypt_1.default.compare(password, user.password) : null;
        if (!hashedPassword) {
            throw (0, http_errors_1.default)(401, "Invalid Credentials");
        }
        const token = util.createToken(user._id);
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400),
            sameSite: "none",
            secure: true,
        });
        res.status(201).json(user.email);
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
