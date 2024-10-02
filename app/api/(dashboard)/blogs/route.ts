import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";
import { Types } from "mongoose";
import { resourceUsage } from "process";
import { request } from "http";
import Blog from "@/lib/modals/blog";

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const searchkeywords = searchParams.get("keywords") as string;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "invlaid or missing userId" }),
        { status: 404 }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 404 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "user is not found in DB" }),
        { status: 404 }
      );
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "category is not found in DB " }),
        { status: 404 }
      );
    }

    const filter: any = {
      user: new Types.ObjectId(userId),
      Category: new Types.ObjectId(categoryId),
    };

    if (searchkeywords) {
      filter.$or = [
        // $or : for one of them
        {
          title: { $regex: searchkeywords, $options: "i" }, // i : for all status no sesitive for char status  ,
          //$regex : for search keywords by used regular expression(string reqular expression)
        },
        {
          description: { $regex: searchkeywords, $options: "i" },
        },
      ];
    }
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
      };
    } else if (endDate) {
      filter.createdAt = {
        $lte: new Date(endDate),
      };
    }
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter)
      .sort({ createdAt: "asc" })
      .skip(skip)
      .limit(limit);

    return new NextResponse(JSON.stringify({ blogs }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in getting the Blog " + error.message, {
      status: 500,
    });
  }
};

// to create a new blog
export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    const body = await request.json();

    const { title, description } = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 404 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing category" }),
        { status: 404 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "user is not found in DB" }),
        { status: 404 }
      );
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "category is not found in DB" }),
        { status: 404 }
      );
    }

    const newBlog = new Blog({
      title,
      user: new Types.ObjectId(userId),
      description,
      Category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();

    return new NextResponse(
      JSON.stringify({ message: "the Blog is Creating!" }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in creating the Blog ! " + error.message, {
      status: 500,
    });
  }
};
