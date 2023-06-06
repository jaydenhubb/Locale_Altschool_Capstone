import 'dotenv/config'
import express from 'express';
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorMiddleware';
import userRoute from "./routes/userRoute"
import statesroute from "./routes/datatRoute"
import { limiter } from './middlewares/limiter';
import client from './cachLayer/cache'



const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    cors({
      origin: ["http://localhost:3000",],
      credentials: true,
    })
  );

app.use(limiter)
// app.get('/api/data/getInfo', async(req, res, next)=>{
//   try {
//     client.on("connect", function () {
//       console.log("Connection Successful!!");
//   });
//   client.on("error", function (err) {
//     console.log("Error: " + err);
//   });
//   client.on("close", function () {
//     console.log("Connection Closed!!");
//   });
//   client.get
//   } catch (error) {
//       next(error)
//   }
// })
app.use('/api/users', userRoute)
app.use('/api/data', statesroute)

app.use(errorHandler);
export default app