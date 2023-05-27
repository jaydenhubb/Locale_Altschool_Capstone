import {RequestHandler} from 'express'
import createHttpError  from 'http-errors'
import StatesModel from '../models/states'
import states from '../models/states';





interface stateBody {
    name: string;
    capital: string
    population: string;
    slogan:string
    landmass:string
    lgas:string
    region: string
    governor: string

}

export const trial: RequestHandler<unknown, unknown, stateBody, unknown>= async(req, res, next)=>{
    const {name, capital, population, slogan, landmass, lgas, region, governor} = req.body
    try {
        if(!name||!capital||!population||!slogan||!landmass||!lgas||!region||!governor){
            throw createHttpError(400, "all fields must be filled")
        }
        // console.log(lgas);
        const newArr= lgas.split(",")
        const state =await StatesModel.create({
            name, capital, population, slogan, landmass, lgas:newArr, region, governor
        })
        res.status(201).json({name, capital, population, slogan, landmass, lgas, region, governor})
    } catch (error) {
        next(error)
    }
}



interface reqQuery {
    state?: string
    lgas?:string
    region?:string
}

export const getData : RequestHandler<unknown, unknown, unknown, reqQuery>= async(req, res, next)=>{
    try {
        const {state, lgas, region} = req.query
        if(region && !state && !lgas){
            const info = await StatesModel.find({region:region})
            if(!info){
                throw createHttpError(404, "No data found. Perhaps check your spellings?")
            }
            const result = info.map((ans)=>{
                return ans.name
            })
            res.status(200).json({
                "Number of states in region": info.length,
                "States in region": result
            })
        }
        else if(state && !region && !lgas){
            const info = await StatesModel.find({name:state})
            if(!info){
                throw createHttpError(404, "No data found. Perhaps check your spellings?")
            }
            const result = info.map((ans)=>{
                return {"State": ans.name,
                        "Capital": ans.capital,
                        "Slogan": ans.slogan,
                        "Governor": ans.governor,
                        "Region": ans.region
            }
            })
            res.status(200).json(result)
        }
        else if(lgas && !state && !region){
            const info = await StatesModel.find({})
            const result = info.filter((val)=>{
                return val.lgas.includes(lgas)
            })
            console.log(result);
            // console.log(info);
            
            if(!info){
                throw createHttpError(404, "No data found. Perhaps check your spellings?")
            }
            // const results = info.map((ans)=>{
            //     return {"State": ans.name,
            //             "Capital": ans.capital,
            // }
            // })
            res.status(200).json(result)
        }

    } catch (error) {
        next(error)
    }
}