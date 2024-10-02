import {request} from "http"
import { NextResponse } from "next/server";
import { Error, Types } from "mongoose";
import { Mongoose } from "mongoose";
import User from "@/lib/modals/user";
import connect from "@/lib/db";

const ObjectId= require("mongoose").Types.ObjectId;

export const DELETE =async(request : Request) =>{
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId)
    {
        return new NextResponse("user id is not found");

    }

    const delelteuser = await User.findByIdAndDelete (new Types.ObjectId(userId));

    if (!delelteuser){
        return new NextResponse("Error deleting user");

    }
    return new NextResponse(    JSON.stringify(delelteuser) + {status:200});
};

export const PATCH =async (request : Request)=>
{
    try{
        const body = await request.json();
        const {userId,newname} = body;
        await connect();
        if (!userId || !newname){
            return new NextResponse("Error updating user");

        }
        if(!Types.ObjectId.isValid(userId)){
            return new NextResponse("Error updating user");
        }
        const updateduser = await User.findOneAndUpdate({
            _id :new ObjectId(userId)},
        {username:newname},
    {new : true});
    }catch(error:any){
        return new NextResponse("Error updating user");
    }
};
