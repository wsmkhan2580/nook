import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";

// GET /api/posts — fetch all posts, newest first
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
};

// GET /api/posts/user/mine — fetch posts belonging to the logged-in user
export const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your posts", error: error.message });
  }
};

// GET /api/posts/user/:userId — fetch posts belonging to any user (public)
export const getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch posts", error: error.message });
  }
};

// GET /api/posts/:id — fetch a single post (for detail view)
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post", error: error.message });
  }
};

// POST /api/posts — create a new post (caption + image via multer buffer -> Cloudinary)
// req.user is attached by optionalAuth — post gets a real author if logged in
export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "instaclone_posts",
    });

    const newPost = await Post.create({
      caption,
      imageUrl: result.secure_url,
      author: req.user?._id,
      authorName: req.user?.username || "Anonymous",
    });

    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: "Failed to create post", error: error.message });
  }
};

// PUT /api/posts/:id — update a post's caption (only the author can)
export const updatePost = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!caption || !caption.trim()) {
      return res.status(400).json({ message: "Caption cannot be empty" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author && req.user && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    post.caption = caption.trim();
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: "Failed to update post", error: error.message });
  }
};

// DELETE /api/posts/:id — remove a post (only the author can)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author && req.user && post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post", error: error.message });
  }
};

// PATCH /api/posts/:id/like — toggle like, once per anonymous userId
export const likePost = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likedBy.includes(userId);

    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter((id) => id !== userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to like post", error: error.message });
  }
};

// POST /api/posts/:id/comments — add a comment (requires login)
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      author: req.user._id,
      authorName: req.user.username,
      text: text.trim(),
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: "Failed to add comment", error: error.message });
  }
};

// DELETE /api/posts/:id/comments/:commentId — remove a comment (only its author can)
export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment", error: error.message });
  }
};
