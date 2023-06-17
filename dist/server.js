"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const validateEnvs_1 = __importDefault(require("./utils/validateEnvs"));
const mongoose_1 = __importDefault(require("mongoose"));
const cache_1 = __importDefault(require("./cachLayer/cache"));
// import swaggerDocs from "./utils/swagger"
const port = validateEnvs_1.default.PORT;
cache_1.default.connect();
mongoose_1.default.connect(validateEnvs_1.default.MONGO_URI)
    .then(() => {
    app_1.default.listen(port, () => {
        // swaggerDocs(app, port)
        console.log('server running on port : ', port, 'and connected to the database');
    });
}).catch(console.error);
