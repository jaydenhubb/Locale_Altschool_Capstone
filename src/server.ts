import app from './app'
import env from './utils/validateEnvs'
import mongoose from 'mongoose';
import client from './cachLayer/cache'
// import swaggerDocs from "./utils/swagger"

const port = env.PORT

client.connect()
mongoose.connect(env.MONGO_URI)
.then(()=>{
    app.listen(port, ()=>{
        // swaggerDocs(app, port)
        console.log('server running on port : ', port ,'and connected to the database');
        
    })
}).catch(console.error)