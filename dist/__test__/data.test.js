"use strict";
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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const generate_api_key_1 = __importDefault(require("generate-api-key"));
const user_1 = __importDefault(require("../models/user"));
const states_1 = __importDefault(require("../models/states"));
const mongoose_1 = __importDefault(require("mongoose"));
// Note: This test case breaks when the redis client is activated 
// in the target route. I will tackle this problem soon enough. 
// so while running this test, please comment out redis caching in the main controller route.
const createState = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield states_1.default.create({
        name: "some string",
        capital: "some string",
        population: "some string",
        slogan: "some string",
        landmass: "some string",
        lgas: ["some string"],
        region: "some string",
        governor: "some string",
        deputy: "some string",
    });
});
const key = (0, generate_api_key_1.default)({
    method: "base32",
    dashes: false,
    prefix: "jay",
});
describe("Accessing data from API", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create a new instance of the in memory server
        const mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        yield mongoose_1.default.connect(mongoServer.getUri());
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield mongoose_1.default.connection.close();
    }));
    it('should return return 200 with a valid apikey', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_1.default.create({
            email: "user1@gmail.com",
            password: 'pleasework1',
            apiKey: key
        });
        createState();
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/data/getInfo')
            .query({
            region: 'some string',
            apikey: user.apiKey
        });
        expect(res.statusCode).toBe(200);
    }));
    it('should return return 401 with a invalid apikey', () => __awaiter(void 0, void 0, void 0, function* () {
        yield user_1.default.create({
            email: "user1@gmail.com",
            password: 'pleasework1',
            apiKey: key
        });
        createState();
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/data/getInfo')
            .query({
            region: 'some string',
            apikey: "invalid key"
        });
        expect(res.statusCode).toBe(401);
    }));
    it('should return return 404 if search term is not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield user_1.default.create({
            email: "user1@gmail.com",
            password: 'pleasework1',
            apiKey: key
        });
        createState();
        const res = yield (0, supertest_1.default)(app_1.default)
            .get('/api/data/getInfo')
            .query({
            region: 'not found ',
            apikey: user.apiKey
        });
        expect(res.statusCode).toBe(404);
    }));
});
