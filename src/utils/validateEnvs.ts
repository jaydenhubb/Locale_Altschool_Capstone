import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
    MONGO_URI: str(),
    PORT: port(),
    JWT_SECRET:str(),
    REDIS_HOST:str(),
    REDIS_PORT:port(),
    REDIS_PASSWORD:str(),
    
})