"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const datatRoute_1 = __importDefault(require("./routes/datatRoute"));
const limiter_1 = require("./middlewares/limiter");
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000",],
    credentials: true,
}));
app.use(limiter_1.limiter);
app.use('/api/users', userRoute_1.default);
app.use('/api/data', datatRoute_1.default);
app.use(errorMiddleware_1.default);
exports.default = app;
