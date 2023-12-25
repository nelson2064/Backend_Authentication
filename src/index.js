import { error, log } from 'console';
import app from './app.js'
import logger from './configs/logger.config.js';
import mongoose, { mongo } from 'mongoose';

//env variables
const { DATABASE_URL } = process.env
const PORT  = process.env.PORT || 8000;


//exit on mongodb error
mongoose.connection.on('error',(err)=>{
  logger.error(`Mongodb connection error: ${err}`);
  process.exit(1);  //closing server 
})



//mongodb debug mode
if(process.env.NODE_ENV !== "production"){
  // console.log("working")
  mongoose.set("debug",true);
}


// mongodb connection 
// mongoose.connect(DATABASE_URL,{
//   useNewUrlParser: true,
//   useUnifiedTopology:true,

// }).then(()=>{
//   logger.info("Connected to MongoDB.")
// })
mongoose.connect(DATABASE_URL).then(()=>{
  logger.info("Connected to MongoDB.")
})

let server = app.listen(PORT,()=>{
  logger.info(`server is listening at ${PORT} ....`)                   //   logger.error()


  // console.log("process id", process.pid)  
// throw new Error("error in server.");
})


//handle server errors
const exitHandler = () => {
    if (server) {
      logger.info("Server closed.");
      process.exit(1); //when you exit with 1 that means you exit the server also kill the process and also throw the error //if you do with 0 it means there is no error //so when you exit with 1 there is a problem
    } else {
      process.exit(1);
    }
  };

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
  };
  
  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);
  
  //SIGTERM
  process.on("SIGTERM", () => { //try taskkill /pid 1343 /f  //if it get this signal then exit process you can use 1 or 0  Typically signifies a successful and normal termination of the process.In the context of a Node.js application, you might use process.exit(0) to indicate that the application shut down without encountering any critical errors.  Often used to indicate an abnormal termination or an error condition  In the context of a Node.js application, you might use process.exit(1) to indicate that the application shut down due to an error or some exceptional condition.
    if (server) {
      logger.info("Server closed.");
      process.exit(1);
    }
  });
  


  // In summary, the code establishes a server, handles errors during its operation, and sets up event listeners to gracefully handle unexpected errors, uncaught exceptions, unhandled rejections, and SIGTERM signals for a controlled shutdown. The exit codes are used to indicate the nature of the termination (normal or with an error).