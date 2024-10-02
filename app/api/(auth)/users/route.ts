import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";
import { Types } from "mongoose";
import { resourceUsage } from "process";
import { request } from "http";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
    try {
        await connect();
        const user = await User.find();
        return new NextResponse(JSON.stringify(user), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Error" + error.message, { status: 500 });
    }
};

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connect();
        const newUser = new User(body);
        await newUser.save();

        return new Response(
            JSON.stringify({ message: "user is created", user: newUser }),
            { status: 200 }
        );
    } catch (error: any) {
        return new Response("Error in creating user" + error.message, {
            status: 500,
        });
    }
};

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId, newusername } = body;
        await connect();

        if (!userId || !newusername) {
            return new NextResponse(
                JSON.stringify({ message: "id or username is not found" }),
                { status: 500 }
            );
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid user id" }), {
                status: 500,
            });
        }

        const updateUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newusername },
            { new: true }
        );
        if (!updateUser) {
            return new NextResponse(JSON.stringify({ message: "User not found" }), {
                status: 400,
            });
        }
        return new NextResponse(JSON.stringify({ message: "User updated" }), {
            status: 200,
        });
    } catch (error: any) {
        return new NextResponse("Error in updating user" + error.message, {
            status: 500,
        });
    }
};

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return new NextResponse(
                JSON.stringify({
                    message: "userId is found ",
                }),
                { status: 400 }
            );
        }

        const deleteUser = await User.findByIdAndDelete(new Types.ObjectId(userId));

        if (!deleteUser) {
            return new NextResponse(JSON.stringify({ Message: "User not found" }), {
                status: 400,
            });
        }
        return new NextResponse(JSON.stringify({ Message: "User deleted" }), {
            status: 200,
        });
    } catch (error: any) {
        return new NextResponse("Error deleting" + error, { status: 500 });
    }
};
