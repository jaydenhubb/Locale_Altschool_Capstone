import { model, InferSchemaType, Schema } from "mongoose"

const stateSchema = new Schema({
    name: String,
    capital: String,
    governor: String,
    slogan: String,
    population: String,
    landmass: String,
    lgas: Array,
    region:String, 
    deputy: String
})

type State = InferSchemaType<typeof stateSchema>

export default model<State>("State", stateSchema)