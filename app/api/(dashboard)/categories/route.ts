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
        JSON.stringify({ message: "Invalid or missing user" }),
        {
          status: 400,
        }
      );
    }
    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in database " }),
        {
          status: 400,
        }
      );
    }

    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });

    return new NextResponse(JSON.stringify(categories), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error in fetching category" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const { title } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId." }),
        {
          status: 400,
        }
      );
    }
    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in DB." }),
        { status: 500 }
      );
    }

    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });

    if (!newCategory) {
      return new NextResponse(
        JSON.stringify({ message: "unable to create category." }),
        {
          status: 500,
        }
      );
    }

    await newCategory.save();

    return new NextResponse(
      JSON.stringify({
        message: "Category id created ",
        category: newCategory,
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new NextResponse("ERROR in creating category " + error.message);
  }
};
