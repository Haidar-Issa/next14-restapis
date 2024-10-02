import { Schema, model, models } from "mongoose";
import { describe } from "node:test";
import Category from "./category";

const BlogSchema = new Schema(
  {
    title: { type: "string", required: true },
    user: { type: Schema.Types.ObjectId, required: true },
    description: { type: "string" },
    Category: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

const Blog = models.Blog || model("Blog", BlogSchema);

export default Blog;
