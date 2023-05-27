import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken"
import env from '../utils/validateEnvs'
import UserModel from '../models/user'

export const RequireAuth: RequestHandler = async(req, res, next)=>{
    interface JwtPayload{
        _id: string
    }

    try {
        const token = req.cookies.token
        if(!token){
            next(createHttpError(401, "User Not Authenticated, Please Log in"))
        }
        const {_id }= jwt.verify(token, env.JWT_SECRET ) as JwtPayload
        const user = await UserModel.findById(_id)
        if(!user){
            next(createHttpError(404, "User not found"))
        }else{
            next()
        }
       
    } catch (error) {
        next(error)
    }
}