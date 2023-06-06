import supertest from "supertest";
import app from '../app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import UserModel from '../models/user'
import mongoose from 'mongoose'


beforeEach(async () => {
    const mongoServer = await MongoMemoryServer.create()


    await mongoose.connect(mongoServer.getUri())
})

afterEach(async () => {
    await mongoose.disconnect()
    await mongoose.connection.close()
})
describe("accessing data from API", ()=>{
    it("should return 401 without valid API key", async()=>{
        const queryParam= "justus"
        const response = await supertest(app)
        .get('/api/data/getInfo')
        .query({param:queryParam})
        expect(response.statusCode).toBe(401);
    })
})