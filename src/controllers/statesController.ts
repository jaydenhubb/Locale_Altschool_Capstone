import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import StatesModel from '../models/states'
import client from '../cachLayer/cache'







interface stateBody {
    name: string;
    capital: string
    population: string;
    slogan: string
    landmass: string
    lgas: string
    region: string
    governor: string
    deputy: string
}
export const trial: RequestHandler<unknown, unknown, stateBody, unknown> = async (req, res, next) => {
    const { name, capital, population, slogan, landmass, lgas, region, governor, deputy } = req.body
    try {
        if (!name || !capital || !population || !slogan || !landmass || !lgas || !region || !governor) {
            throw createHttpError(400, "all fields must be filled")
        }
        const newArr = lgas.split(",")
        await StatesModel.create({
            name, capital, population, slogan, landmass, lgas: newArr, region, governor, deputy
        })
        res.status(201).json({ name, capital, population, slogan, landmass, lgas, region, governor, deputy })
    } catch (error) {
        next(error)
    }
}



interface reqQuery {
    state?: string
    lgas?: string
    region?: string
}
export const getData: RequestHandler<unknown, unknown, unknown, reqQuery> = async (req, res, next) => {

    try {
        const { state, lgas, region } = req.query

        if (!region && !lgas && !state) {
            throw createHttpError(400, "You must attach a 'state', 'lgas', or 'region' and it's corresponding search term to proceed. Vist the documentation to see the guide. ")
        }

        if (region) {
            const data = region.toLowerCase().trim()
            // set cach key
            // const cachedKey = `Data : ${data}`
            // Check it's existence in the cache
            // const cachedData = await client.get(cachedKey)
            // if (cachedData) {
                // return res.status(200).json(JSON.parse(cachedData))
            // }
            const info = await StatesModel.find({ region: data })
            if (info.length === 0) {
                throw createHttpError(404, `No data found. Perhaps check if you spelt ${data.toUpperCase()} correctly?`)
            }
            const result = info.map((ans) => {
                return ans.name
            })
            const resData = {
                "Number of states in region": info.length,
                "States in region": result
            }
            // set cach value 
            // await client.setEx(cachedKey, 600, JSON.stringify(resData))
            res.status(200).json(resData)
        }

        else if (state) {
            const data = state.toLowerCase().trim()
            const cachedKey = `Data : ${data}`
            const cachedData = await client.get(cachedKey)
            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData))
            }
            const info = await StatesModel.find({ name: data })
            if (info.length === 0) {
                throw createHttpError(404, `No data found. Perhaps check if you spelt ${data.toUpperCase()} correctly?`)
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
                }
            })
            // await client.setEx(cachedKey, 600, JSON.stringify(result))
            res.status(200).json(result)
        }

        else if (lgas) {
            const data = lgas.toLowerCase().trim()
            const cachedKey = `Data : ${data}`
            const cachedData = await client.get(cachedKey)
            if (cachedData) {
                return res.status(200).json(JSON.parse(cachedData))
            }
            const info = await StatesModel.find({ lgas: data })
            if (info.length===0) {
                throw createHttpError(404, `No data found. Perhaps check if you spelt ${data.toUpperCase()} correctly?`)
            }
            const result = {  
                "Location": info[0].name,
                "Region":info[0].region,
            }           
            await client.setEx(cachedKey, 600, JSON.stringify(result))
            res.status(200).json(result)
        }
    } catch (error) {
        next(error)
    }
}
