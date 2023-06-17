"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const stateSchema = new mongoose_1.Schema({
    name: String,
    capital: String,
    governor: String,
    slogan: String,
    population: String,
    landmass: String,
    lgas: Array,
    region: String,
    deputy: String
});
exports.default = (0, mongoose_1.model)("State", stateSchema);
