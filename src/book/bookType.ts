import UserType from "../user/userType";

export interface Book{
    _id:string;
    title:string;
    author:UserType;
    genre:string;
    coverImage:string;
    file:string;
    createdAt:Date;
    updatedAt:Date

}