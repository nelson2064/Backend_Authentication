import mongoose from 'mongoose'
import validator from "validator";
import bcrypt from 'bcrypt'



const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide your name"],
    },
    email:{
        type:String,
        required:[true, 'Please provide your email address'],
        unique:[true, "This email address already exist"],
        lowercase:true,
        validate:[validator.isEmail, "Please provide a valid email address"]
    },
    picture:{
        type:String,
        defaullt: "https://res.cloudinary.com/dkd5jblv5/image/upload/v1675976806/Default_ProfilePicture_gjngnb.png"
    },
    status:{
        type:String,
        default:'Hey there ! I am using whatsapp',
    },
    password:{
        type:String,
        required:[true, "please provide your passowrd"],
        minLength:[6,"Please make sure your password is at least 6 characters long"],
        maxLenght:[128, "Please make sure your password is less then 128"]
    },
},

{
collection:"users",
timestamps:true,
}

);

userSchema.pre('save',async function(next){
    try{
        if(this.isNew){
            const salt  = await bcrypt.genSalt(12); //tells the strenght of encryption
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        }
        next();
    }catch(error){
        next(error)
    }
});

const UserModel = mongoose.models.UserModel || mongoose.model('UserModel',userSchema);

export default UserModel;
