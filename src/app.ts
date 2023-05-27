import 'dotenv/config'
import express from 'express';
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import errorHandler from './middlewares/errorMiddleware';
import userRoute from "./routes/userRoute"
import statesroute from "./routes/datatRoute"


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

app.use('/api/users', userRoute)
app.use('/api/data', statesroute)

app.use(errorHandler);
export default app