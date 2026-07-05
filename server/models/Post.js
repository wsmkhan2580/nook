import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxLength: [300, "Comment cannot exceed 300 characters"],
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: [true, "Caption is required"],
      trim: true,
      maxLength: [500, "Caption cannot exceed 500 characters"],
    },
    imageUrl: {
      type: String,
      required: [true, "Image is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // stays optional so older/anonymous posts don't break
    },
    authorName: {
      type: String,
      default: "Anonymous",
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String],
      default: [],
    },
    comments: {
      type: [commentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
