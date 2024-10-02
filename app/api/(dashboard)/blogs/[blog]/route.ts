import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";
import { Types } from "mongoose";
import { resourceUsage } from "process";
import { request } from "http";
import Blog from "@/lib/modals/blog";

export const GET = async (request: Request, context: { params: any }) => {
  try {
    const blogId = context.params.blog;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 404 }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryid" }),
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
        JSON.stringify({ message: "category not found in DB" }),
        { status: 404 }
      );
    }

    const blog = await Blog.findOne({
      _id: blogId,
      user: userId,
      Category: categoryId,
    });

    if (!blog) {
      return new NextResponse(JSON.stringify({ message: "blog not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ blog }), { status: 200 });
  } catch (error: any) {
    return new NextResponse("Error in fetching blog" + error.message);
  }
};

// for update blog status

export const PATCH = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const body = await request.json();
    const { title, description } = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or Missing userId" }),
        { status: 404 }
      );
    }
    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "invlaid or missing blogId" }),
        { status: 404 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "user is not found in DB " }),
        { status: 404 }
      );
    }

    const updateBlog = await Blog.findByIdAndUpdate(
      blogId,
      {
        title,
        description,
      },
      { new: true }
    );
    if (!updateBlog) {
      return new NextResponse(
        JSON.stringify({ message: "Error in updating blog" }),
        { status: 500 }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: "the blog is updating" }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in updating blog" + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const blogId = context.params.blog;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or Missing userId" }),
        { status: 404 }
      );
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return new NextResponse(
        JSON.stringify({ message: "invlaid or missing blogId" }),
        { status: 404 }
      );
    }
    await connect();
    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "user is not found in DB " }),
        { status: 404 }
      );
    }

    await Blog.findByIdAndDelete(blogId, {
      user: userId,
    });

    return new NextResponse(
      JSON.stringify({ message: "delete blog is done" }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting blog" + error.message, {
      status: 500,
    });
  }
};
