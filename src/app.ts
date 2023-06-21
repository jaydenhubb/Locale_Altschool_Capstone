import 'dotenv/config'
import express from 'express';
import morgan from 'morgan'
// import cors from 'cors'
// import * as cors from 

import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorMiddleware';
import userRoute from "./routes/userRoute"
import statesroute from "./routes/datatRoute"
import { limiter } from './middlewares/limiter';

const cors = require('cors')



const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   next();
// });

app.use(limiter)
app.use('/api/users', userRoute)
app.use('/api/data', statesroute)
app.use(errorHandler);
export default app
