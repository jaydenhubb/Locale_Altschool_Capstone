import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from '../models/user'

interface reqQuery {
    state?: string
    lgas?: string
    region?: string
    apikey?: string
}

export const RequireAuth: RequestHandler<unknown, unknown, unknown, reqQuery> = async (req, res, next) => {

    try {
        const { apikey } = req.query
        if (!apikey) {
            next(createHttpError(401, "User Not Authenticated, Please use a valid APikey or create an account to get one"))
        }
        const user = await UserModel.findOne({ apiKey: apikey })
        if (!user) {
            next(createHttpError(404, "Invalid API key"))
        } else {
            next()
        }
    } catch (error) {
        next(error)
    }
}