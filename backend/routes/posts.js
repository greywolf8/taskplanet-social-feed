const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Create post
router.post("/", auth, async (req, res) => {
  try {
    const { content, image, category } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = new Post({
      author: req.userId,
      content,
      image: image || null,
      category: category || "All Posts",
    });

    await post.save();
    await post.populate("author", "username profilePicture");

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all posts with pagination
router.get("/", async (req, res) => {
  try {
    const { category, sortBy } = req.query;
    let filter = {};

    if (category && category !== "All Posts") {
      filter.category = category;
    }

    let query = Post.find(filter)
      .populate("author", "username profilePicture")
      .populate("comments.author", "username profilePicture");

    if (sortBy === "likes") {
      query = query.sort({ likeCount: -1 });
    } else if (sortBy === "comments") {
      query = query.sort({ commentCount: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const posts = await query.limit(50);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single post
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("author", "username profilePicture")
      .populate("comments.author", "username profilePicture");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete post
router.delete("/:postId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.postId);
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Like post
router.post("/:postId/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.includes(req.userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.userId);
      post.likeCount = Math.max(0, post.likeCount - 1);
    } else {
      post.likes.push(req.userId);
      post.likeCount += 1;
    }

    await post.save();
    await post.populate("author", "username profilePicture");

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add comment
router.post("/:postId/comment", auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      author: req.userId,
      text,
    });
    post.commentCount += 1;

    await post.save();
    await post.populate("author", "username profilePicture");
    await post.populate("comments.author", "username profilePicture");

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete comment
router.delete("/:postId/comment/:commentId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    post.comments = post.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );
    post.commentCount = Math.max(0, post.commentCount - 1);

    await post.save();
    await post.populate("author", "username profilePicture");
    await post.populate("comments.author", "username profilePicture");

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Search posts
router.get("/search", async (req, res) => {
  try {
    const { q, category } = req.query;
    if (!q) {
      return res.json([]);
    }

    let filter = {
      $or: [
        { content: { $regex: q, $options: "i" } },
        { "author.username": { $regex: q, $options: "i" } }
      ]
    };

    if (category && category !== "All Posts") {
      filter.category = category;
    }

    const posts = await Post.find(filter)
      .populate("author", "username profilePicture")
      .populate("comments.author", "username profilePicture")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
