import jwt from 'jsonwebtoken'
import { Types } from "mongoose"
import env from './validateEnvs'





export const createToken = (id: Types.ObjectId)=>{
    return jwt.sign({id}, env.JWT_SECRET, { expiresIn: "1d"})
}