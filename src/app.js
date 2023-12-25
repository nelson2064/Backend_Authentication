import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan'
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize'
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cors from 'cors'
import createHttpError from 'http-errors';
import routes from "./routes/index.js"
dotenv.config();
const app = express();



if(process.env.NODE_ENV !== "production"){
    app.use(morgan("dev"));
}

app.use(helmet());
//parse json request url
app.use(express.json())
//parse json request body
app.use(express.urlencoded({extended:true}));
//sanitize request data
app.use(mongoSanitize())
//Enabe cookie parser
app.use(cookieParser())
//gzip compression
app.use(compression())
//file upload
app.use(fileUpload({
    useTempFiles:true,
}))
//cors
// app.use(cors({
//     origin:"http://localhost:3000",
// }))
app.use(cors())


//api v1 routes
app.use("/api/v1",routes);











// app.post('/',(req , res)=>{
  
//    throw createHttpError.BadRequest("this route has an error");
// })



app.use(async(req, res , next)=>{
    next(createHttpError.NotFound("This route does not exist"));
})

//error handling
app.use(async(err , req , res, next)=>{
    res.status(err.status || 500);
    res.send({
        error:{
            status:err.status || 500,
            message:err.message
        }
    })
})

export default app;
