import { model, InferSchemaType, Schema } from "mongoose"
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    email: {
        type: String, required: true, unique: true, match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email",
        ],
        trim: true, select: false
    },
    password: { type: String, required: [true, "Please add a password"], select: false },
    apiKey: { type: String, },
    viewed: {type: Boolean, default:false}

}, {
    timestamps: true
})


userSchema.pre("save", async function(next){
    if(!this.isModified('password')){
        return next()
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
})
type User = InferSchemaType<typeof userSchema>

export default model<User>("LocalUser", userSchema)

