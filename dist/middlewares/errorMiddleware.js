"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = require("http-errors");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (error, req, res, next) => {
    let errorMessage = "An unknown error occured";
    let statusCode = 500;
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    if (error instanceof Error)
        errorMessage = error.message;
    res.status(statusCode).json({ error: errorMessage });
};
exports.default = errorHandler;
