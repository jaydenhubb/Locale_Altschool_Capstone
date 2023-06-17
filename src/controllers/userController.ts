import {RequestHandler} from 'express'
import createHttpError  from 'http-errors'
import UserModel from '../models/user'
import  * as util  from "../utils";
import generateApiKey from 'generate-api-key';
import bcrypt from 'bcrypt'

interface SignUpBody {
    email: string;
    password: string;
    apiKey?:string
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown>= async(req, res, next)=>{
    const {email, password} = req.body;
    try {
        // validate data
        if(!password || !email){
            throw createHttpError(400, 'Please provide email and password');
        }
        if(password.length < 6){
            throw createHttpError(400, 'Password must be at least 6 characters');
        }
        // check database if it exists
        const exists = await UserModel.findOne({email}).exec()
        if(exists){
                    throw createHttpError(400, 'Email already exists');
                }
        // create APIkey
        const apiKey = generateApiKey({
            method: "base32",
            dashes: false,
            prefix: "jay",
          });
        // create user
        const user = await UserModel.create({
            email,
            password,
            apiKey,
            
        })
        await user.save()
        
        // create token
        const token = util.createToken(user._id)
        
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), //one day
            sameSite: "none",
            secure: true,
          });
          if(user){
            const {email }= user
            res.status(201).json({email, "key": apiKey })
          }
    }

    catch (error) {
        next(error)
    }
}

interface loginBody {
    email:string
    password:string
}

export const login: RequestHandler<unknown, unknown, loginBody, unknown>= async(req, res, next)=>{
    const {email, password} = req.body;
    try{
        if(!email||!password ){
            throw createHttpError(400, "Email and Password are required")
        }
        const user = await UserModel.findOne({email}).select("+password").select("+email").exec()
        if(!user){
            throw createHttpError(401, "Invalid Credentials")
        }
        
        const hashedPassword = user.password != undefined ? await bcrypt.compare(password, user.password) : null
        if(!hashedPassword){
            throw createHttpError(401, "Invalid Credentials")
        }
        const token = util.createToken(user._id)
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), //one day
            sameSite: "none",
            secure: true,
          });
        res.status(201).json(user.email)
    }catch(error){
        next(error)
    }
}

