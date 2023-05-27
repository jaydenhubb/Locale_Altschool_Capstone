import {RequestHandler} from 'express'
import createHttpError  from 'http-errors'
import UserModel from '../models/user'
import  * as util  from "../utils";
import generateApiKey from 'generate-api-key';
import crypto from 'crypto'
import bcrypt from 'bcrypt'

interface SignUpBody {
    email: string;
    password: string;
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
        
        // hash key
        const hashKey = crypto.createHash('sha256').update(apiKey.toString()).digest('hex')
        console.log(typeof(hashKey));
        
        
        
        // hass Password
        // const hashedPassword = hashPass(password)
        // console.log(typeof(hashedPassword));
        // console.log(hashedPassword);
        
        // create user
        const user = await UserModel.create({
            email,
            password,
            apiKey:hashKey
        })
        // create token
        const token = util.createToken(user._id)
        // console.log(token);
        
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 86400), //one day
            sameSite: "none",
            secure: true,
          });
          if(user){
            const {email, apiKey}= user
            res.status(201).json({email, apiKey})
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
    
        
        const hashedPassword = await bcrypt.compare(password, user.password)
    
        
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