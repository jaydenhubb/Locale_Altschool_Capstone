import supertest from "supertest";
import app from '../app'
import { MongoMemoryServer } from 'mongodb-memory-server'
import generateApiKey from 'generate-api-key';
import UserModel from '../models/user'
import StatesModel from '../models/states'
import mongoose from 'mongoose'



// Note: This test case breaks when the redis client is activated 
// in the target route. I will tackle this problem soon enough. 
// so while running this test, please comment out redis caching in the main controller route.

const createState =async()=>{
    return await StatesModel.create({
        name: "some string",
        capital: "some string",
        population: "some string",
        slogan: "some string",
        landmass: "some string",
        lgas: ["some string"],
        region: "some string",
        governor: "some string",
        deputy: "some string",
    })
    }
const key =  generateApiKey({
                method: "base32",
                dashes: false,
                prefix: "jay",
            });
describe("Accessing data from API", ()=>{
    beforeEach(async()=>{
        // Create a new instance of the in memory server
        const mongoServer = await MongoMemoryServer.create()
        await mongoose.connect(mongoServer.getUri())
    })

    afterEach(async()=>{
        await mongoose.disconnect()
        await mongoose.connection.close()
    })

    it('should return return 200 with a valid apikey', async()=>{
        const user = await UserModel.create({
            email:"user1@gmail.com",
            password:'pleasework1',
            apiKey:key
        })
        createState()
        const res = await supertest(app)
        .get('/api/data/getInfo')
        .query({
            region:'some string',
            apikey: user.apiKey
        })
        expect(res.statusCode).toBe(200) 
    })
    it('should return return 401 with a invalid apikey', async()=>{
         await UserModel.create({
            email:"user1@gmail.com",
            password:'pleasework1',
            apiKey:key
        })
         createState()
        const res = await supertest(app)
        .get('/api/data/getInfo')
        .query({
            region:'some string',
            apikey: "invalid key"
        })
        expect(res.statusCode).toBe(401) 
    })
    it('should return return 404 if search term is not found', async()=>{
         const user = await UserModel.create({
            email:"user1@gmail.com",
            password:'pleasework1',
            apiKey:key
        })
         createState()
        const res = await supertest(app)
        .get('/api/data/getInfo')
        .query({
            region:'not found ',
            apikey: user.apiKey
        })
        expect(res.statusCode).toBe(404) 
    })
})



