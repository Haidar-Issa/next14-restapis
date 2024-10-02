import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";
import { Types } from "mongoose";
import { resourceUsage } from "process";
import { request } from "http";
import next from "next";

export const PATCH = async (request: Request, context: { params: any }) => {
  const categoryid = context.params.category; //category is return to file name [category]
  try {
    const body = await request.json();
    const { title } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userid" }),
        { status: 400 }
      );
    }

    if (!categoryid || !Types.ObjectId.isValid(categoryid)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryid" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User is not found in DB" }),
        { status: 404 }
      );
    }
    const category = await Category.findOne({ _id: categoryid, user: userId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "category is not found" }),
        { status: 404 }
      );
    }
    const updateCategory = await Category.findByIdAndUpdate(
      categoryid,
      { title },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "category is update ",
        category: updateCategory,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating category " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const categoryid = context.params.category;
  try {
    const { searchParams } = new URL(request.url);
    const userid = searchParams.get("userId");

    if (!userid || !Types.ObjectId.isValid(userid)) {
      return new NextResponse(
        JSON.stringify({ message: "missing or invalid userid!" }),
        { status: 404 }
      );
    }
    if (!categoryid || !Types.ObjectId.isValid(categoryid)) {
      return new NextResponse(
        JSON.stringify({ message: "missing or invlaid categoryid" }),
        { status: 404 }
      );
    }
    await connect();

    const user = await User.findById(userid);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "user is not found" }),
        { status: 500 }
      );
    }
    const category = await Category.findOne({_id : categoryid , user : userid});
    if (!category){
        return new NextResponse(JSON.stringify({message:"category is not found !"}),{status:404});
    }

    const deleteCategory = await Category.findByIdAndDelete(categoryid);

    if (!deleteCategory) {
      return new NextResponse(
        JSON.stringify({ message: "can not delete Category" }),
        { status: 400 }
      );
    }
    return new NextResponse(JSON.stringify({ message: "category is deleting ! " }), {
      status: 200,
    });

  } catch (error: any) {
    return new NextResponse("error in deleting Category ! " + error.message);
  }
};
