import BlogPost from "../../models/BlogPost.model.js";
import Category from "../../models/category.model.js";
import User from "../../models/User.model.js";
import imageUploadService from "../../services/image-upload.service.js";
import {
  deleteBlogPostKeysFromRedis,
  deleteBlogPostsKeysFromRedis,
} from "../../utils/deleteBlogPostKeysFromRedis.js";
import { cacheData, getCacheData } from "../../utils/redisUtility.js";
import blogPostSchema from "./blogPost.validator.js";

void User;
const createBlogPost = async (req, res) => {
  const { error } = blogPostSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const { title, body, tags, author, category } = req.body;
    const file = req.file;
    const fileUrl = await imageUploadService(file);
    await new BlogPost({
      title,
      body,
      tags,
      author,
      category,
      image: fileUrl,
    }).save();
    await deleteBlogPostsKeysFromRedis();
    res.status(200).json({ message: "Blog post created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error?.message });
  }
};
const getBlogPost = async (req, res) => {
  const { id } = req.params;
  try {
    const cacheKey = `blog-post:${id}`;
    const cachedData = await getCacheData(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        message: "Blog post found from cache",
        post: cachedData,
      });
    }
    const post = await BlogPost.findById(id).populate(
      "author",
      "firstName avatar -_id"
    );
    if (!post) return res.status(404).json({ message: "Blog post not found" });
    await cacheData(cacheKey, post);
    res.status(200).json({
      message: "Blog post found",
      post,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const getBlogPosts = async (req, res) => {
  try {
    const { category, page } = req.query;
    const pageSize = 10;
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;
    const cacheKey = `blog-posts:${category}:${page}`;
    const cachedData = await getCacheData(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        message: "Blog posts found from cache",
        posts: cachedData.posts,
        currentPage,
        totalPages: cachedData.totalPages,
      });
    }
    const filter = {};
    if (typeof category === "string") {
      const categoryId = await Category.findOne({ name: category }).select(
        "_id"
      );
      categoryId
        ? (filter.category = categoryId)
        : res.status(404).json({ message: "Category not found" });
    }

    const posts = await BlogPost.find(filter)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate("author category", "firstName avatar -_id name -_id");
    const totalPosts = await BlogPost.countDocuments(filter);
    if (!totalPosts) {
      await deleteBlogPostsKeysFromRedis();
      return res.status(404).json({ message: "Blog posts not found" });
    }
    await cacheData(cacheKey, {
      posts,
      currentPage,
      totalPages: Math.ceil((await BlogPost.countDocuments(filter)) / pageSize),
    });
    res.status(200).json({
      message: "Blog posts found",
      posts,
      currentPage,
      totalPages: Math.ceil((await BlogPost.countDocuments(filter)) / pageSize),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const updateBlogPost = async (req, res) => {
  const { id } = req.params;
  try {
    const { title, body, category } = req.body;
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      {
        title,
        body,
        category,
      },
      { new: true }
    );
    await deleteBlogPostKeysFromRedis(id);
    await deleteBlogPostsKeysFromRedis();

    res.status(200).json({
      message: "Blog post updated",
      updatedPost,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const updateImage = async (req, res) => {
  const { id } = req.params;
  try {
    const file = req.file;
    const fileUrl = await imageUploadService(file);
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      {
        image: fileUrl,
      },
      { new: true }
    );
    await deleteBlogPostKeysFromRedis(id);
    await deleteBlogPostsKeysFromRedis();
    res.status(200).json({
      message: "Blog post image updated",
      updatedPost,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const deleteBlogPost = async (req, res) => {
  const { id } = req.params;
  try {
    await BlogPost.findByIdAndDelete(id);
    await deleteBlogPostKeysFromRedis(id);
    await deleteBlogPostsKeysFromRedis();
    res.status(200).json({
      message: "Blog post deleted",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const blogPostsSearch = async (req, res) => {
  const { q } = req.query;
  try {
    if (!/^[a-zA-Z0-9\s\-]+$/.test(q))
      return res.status(400).json({ error: "Invalid search query" });
    const results = await BlogPost.find(
      { $text: { $search: q, $language: "en" } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .populate("author", "firstName avatar -_id");
    if (results.length === 0)
      return res
        .status(404)
        .json({ message: "No post found matching the query" });
    res.status(200).json({
      message: "Blog Posts retrieved successfully",
      blogPosts: results,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const getBlogPostByWriter = async (req, res) => {
  const { id } = req.params;
  try {
    const posts = await BlogPost.find({ author: id });
    if (!posts) return res.status(404).json({ message: "Blog post not found" });
    res.status(200).json({
      message: "Blog post found",
      posts,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
export {
  blogPostsSearch,
  createBlogPost,
  deleteBlogPost,
  getBlogPost,
  getBlogPostByWriter,
  getBlogPosts,
  updateBlogPost,
  updateImage,
};
