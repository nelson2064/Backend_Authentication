import createHttpError from "http-errors";
import validator from "validator";
import { UserModel } from "../models/index.js";
import bcrypt from 'bcrypt'


//env variablles
// const {DEFAULT_PICTURE, DEFAULT_STATUS} = process.env;


export const createUser = async(userData)=>{
    const{name , email , picture, status, password} = userData;
    //check if fiedls are empty
    if(!name || !email || !password){
        throw createHttpError.BadRequest("Please fill all fields");
    }

 //check name length
    if(!validator.isLength(name,{min:2, max:16})){
        throw createHttpError.BadRequest("Please make sure your name is between 1 and 16 characters");
    }


    //Check status Length
    if(status && status.length > 64){

        throw createHttpError.BadRequest("Please make sure your status is less then 64 characters");
    
    }


    //ehck if email address is valid
    if(!validator.isEmail(email)){
        throw createHttpError.BadRequest("Please make sure to provide a vlaid email address")
    }
   
    //check if user already exist
    const checkDb = await UserModel.findOne({email});
    if(checkDb){
        throw createHttpError.Conflict("please try againa with a different email address, theis email already exist")
    }

    //check passowrd length
    if(!validator.isLength(password,{min:6, max:128})){
        throw createHttpError.Conflict("please make sure your password is between 6 and 128 length")
    }


    //hash passwrod ----> to be done in the user model


    //adding user to database
    const user = await new UserModel({
        name,
        email,
        picture: picture || process.env.DEFAULT_PICTURE,
        status:status || process.env.DEFAULT_STATUS,
        password,
    }).save();
    


        return user;

}



export const signUser = async (email, password) => {
    try {
      // Convert email to lowercase for case-insensitive matching
      const normalizedEmail = email.toLowerCase();
  
      const user = await UserModel.findOne({ email: normalizedEmail }).lean();
  
      // Check if user exists
      if (!user) {
        throw createHttpError.NotFound("Invalid credentials.");
      }
  
      // Compare passwords
      const passwordMatches = await bcrypt.compare(password, user.password);
  
      // Check if passwords match
      if (!passwordMatches) {
        throw createHttpError.NotFound("Invalid credentials.");
      }
  
      return user;
      
    } catch (error) {
      // Handle other errors or log them for debugging
      throw createHttpError.InternalServerError("Authentication error");
    }
  };