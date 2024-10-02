import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";
import { Types } from "mongoose";
import { resourceUsage } from "process";
import { request } from "http";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "userId is not a valid" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "user is not found in database!" }),
        { status: 400 }
      );
    }
    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });
  } catch (error: any) {
    return new NextResponse("Error in fetching category !" + error.message);
  }
};

export const POST =async(request : Request)=>{
    try{
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get("userId");

    const { title } =  await request.json();

    if (!userId || !Types.ObjectId.isValid(userId))
    {
        return new NextResponse(JSON.stringify({message:"UserID is not Valid"}),{status:400});

    }
    await connect () ;
    
    const user = await User.findById(userId);
    if (!user ){
        return new NextResponse(JSON.stringify({message:"user is not found in database !"}),{status:400});

    }

    const newCategory = new Category(
        {title , 
            user : new Types.ObjectId(userId)
        }
    );
    if (!newCategory){
        return new NextResponse("Error in creating the Category");
    }
    await newCategory.save();
    return new NextResponse(JSON.stringify({message:"the Category is Creating !"}),{status:200});

}catch(error :any){
    return new NextResponse("Error in creating Category !")
}

}
