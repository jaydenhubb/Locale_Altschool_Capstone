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
exports.getData = exports.trial = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const states_1 = __importDefault(require("../models/states"));
const cache_1 = __importDefault(require("../cachLayer/cache"));
const trial = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, capital, population, slogan, landmass, lgas, region, governor, deputy } = req.body;
    try {
        if (!name || !capital || !population || !slogan || !landmass || !lgas || !region || !governor) {
            throw (0, http_errors_1.default)(400, "all fields must be filled");
        }
        const newArr = lgas.split(",");
        yield states_1.default.create({
            name, capital, population, slogan, landmass, lgas: newArr, region, governor, deputy
        });
        res.status(201).json({ name, capital, population, slogan, landmass, lgas, region, governor, deputy });
    }
    catch (error) {
        next(error);
    }
});
exports.trial = trial;
const getData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { state, lgas, region } = req.query;
        if (!region && !lgas && !state) {
            throw (0, http_errors_1.default)(400, "You must attach a 'state', 'lgas', or 'region' and it's corresponding search term to proceed. Vist the documentation to see the guide. ");
        }
        if (region) {
            const data = region.toLowerCase().trim();
            // set cache key
            const cachedKey = `Data : ${data}`;
            // Check it's existence in the cache
            const cachedData = yield cache_1.default.get(cachedKey);
            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }
            const info = yield states_1.default.find({ region: data });
            if (info.length === 0) {
                throw (0, http_errors_1.default)(404, `No data found. Perhaps check if you spelt ${data.toUpperCase()} correctly?`);
            }
            const result = info.map((ans) => {
                return ans.name;
            });
            const resData = {
                "Number of states in region": info.length,
                "States in region": result
            };
            // set cach value 
            yield cache_1.default.setEx(cachedKey, 600, JSON.stringify(resData));
            res.status(200).json(resData);
        }
        else if (state) {
            const data = state.toLowerCase().trim();
            const cachedKey = `Data : ${data}`;
            const cachedData = yield cache_1.default.get(cachedKey);
            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }
            const info = yield states_1.default.find({ name: data });
            if (info.length === 0) {
                throw (0, http_errors_1.default)(404, `No data found. Perhaps check if you spelt ${data.toUpperCase()} correctly?`);
            }
            const result = info.map((ans) => {
                return {
                    "State": ans.name,
                    "Capital": ans.capital,
                    "Governor": ans.governor,
                    "Deputy": ans.deputy,
                    "Population": ans.population,
                    "Land mass": ans.landmass,
                    "Slogan": ans.slogan,
                    "Region": ans.region,
                    "Local Government Areas": ans.lgas
                };
            });
            yield cache_1.default.setEx(cachedKey, 600, JSON.stringify(result));
            res.status(200).json(result);
        }
        else if (lgas) {
            const data = lgas.toLowerCase().trim();
            const cachedKey = `Data : ${data}`;
            const cachedData = yield cache_1.default.get(cachedKey);
            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData));
            }
            const info = yield states_1.default.find({ lgas: data });
            if (info.length === 0) {
                throw (0, http_errors_1.default)(404, `No data found. Perhaps check if you spelt ${data.toUpperCase()} correctly?`);
            }
            const result = {
                "Location": info[0].name,
                "Region": info[0].region,
            };
            yield cache_1.default.setEx(cachedKey, 600, JSON.stringify(result));
            res.status(200).json(result);
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getData = getData;
