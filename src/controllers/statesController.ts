import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import StatesModel from '../models/states'





interface stateBody {
    name: string;
    capital: string
    population: string;
    slogan: string
    landmass: string
    lgas: string
    region: string
    governor: string
    deputy:string
}
 export const trial: RequestHandler<unknown, unknown, stateBody, unknown> = async (req, res, next) => {
    const { name, capital, population, slogan, landmass, lgas, region, governor, deputy } = req.body
    try {
        if (!name || !capital || !population || !slogan || !landmass || !lgas || !region || !governor) {
            throw createHttpError(400, "all fields must be filled")
        }
        // console.log(lgas);
        const newArr = lgas.split(",")
        const state = await StatesModel.create({
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
        if (region?.toLowerCase()) {
            const info = await StatesModel.find({ region: region })
            if (info.length === 0) {
                throw createHttpError(404, "No data found. Perhaps check your spellings?")
            }
            const result = info.map((ans) => {
                return ans.name
            })
            res.status(200).json({
                "Number of states in region": info.length,
                "States in region": result
            })
        }
        else if (state?.toLowerCase()) {
            const info = await StatesModel.find({ name: state })
            if (!info) {
                throw createHttpError(404, "No data found. Perhaps check your spellings?")
            }
            const result = info.map((ans) => {
                return {
                    "State": ans.name,
                    "Capital": ans.capital,
                    "Slogan": ans.slogan,
                    "Governor": ans.governor,
                    "Region": ans.region
                }
            })
            res.status(200).json(result)
        }
        else if (lgas?.toLowerCase().trim()) {
            const info = await StatesModel.find({ lgas: lgas })
            console.log(info);


            if (!info) {
                throw createHttpError(404, "No data found. Perhaps check your spellings?")
            }
            res.status(200).json(info)
        }

    } catch (error) {
        next(error)
    }
}

