
import { createClient } from 'redis';
import env from '../utils/validateEnvs';

const client = createClient({
    password: env.REDIS_PASSWORD,
    socket: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT
    }
});
// client.connect()
client.on("connect", ()=>{
    console.log("redis client connected");
})
client.on('error', ()=>{
    console.log("error connecting");
    client.disconnect()
});




export default client

  