import mongoose from "mongoose";


interface UserType{
    _id:string;
    name:string,
    email:string,
    password:string
}

const userShema=new mongoose.Schema<UserType>({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})


export default mongoose.model<UserType>("User",userShema)//^User ka Users lega db me