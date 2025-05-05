import BlogPost from "../../models/BlogPost.model.js";
import User from "../../models/User.model.js";
import imageUploadService from "../../services/image-upload.service.js";
import blogPostSchema from "./blogPost.validator.js";
import Category from "../../models/category.model.js";

void User;
const createBlogPost = async (req, res) => {
    const {error} = blogPostSchema.validate(req.body)
    if (error) return res.status(400).json({message: error.details[0].message})
    try {
        const {title, body, tags, author, category} = req.body
        const file = req.file
        const fileUrl = await imageUploadService(file)
        await new BlogPost({
            title,
            body,
            tags,
            author,
            category,
            image: fileUrl
        }).save()
        res.status(200).json({message: "Blog post created successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Something went wrong", error: error?.message});
    }
}
const getBlogPost = async (req, res) => {
    const {id} = req.params
    try {
        const post = await BlogPost.findById(id).populate("author", "firstName lastName -_id")
        if (!post) return res.status(404).json({message: "Blog post not found"})
        res.status(200).json({
            message: "Blog post found",
            post
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error", error: error?.message})
    }
}
const getBlogPosts = async (req, res) => {
    try {
        const {category, page} = req.query
        const pageSize = 10;
        const currentPage = Number(page) || 1;
        const skip = (currentPage - 1) * pageSize;
        const filter = {}
        if (typeof category === 'string') {
            const categoryId = await Category.findOne({name: category}).select("_id")
            categoryId ? filter.category = categoryId : res.status(404).json({message: "Category not found"})
        }

        const posts = await BlogPost
            .find(filter)
            .skip(skip)
            .limit(pageSize)
            .sort({createdAt: -1})
            .populate("author category", "firstName lastName -_id name -_id")
        const totalPosts = await BlogPost.countDocuments(filter)
        if (!totalPosts) return res.status(404).json({message: "Blog posts not found"})
        res.status(200).json({
            message: "Blog posts found",
            posts,
            currentPage,
            totalPages: Math.ceil(await BlogPost.countDocuments(filter) / pageSize),

        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error", error: error?.message})
    }
}
const updateBlogPost = async (req, res) => {
    const {id} = req.params
    try {
        await BlogPost.findByIdAndUpdate(id, req.body)
        res.status(200).json({
            message: "Blog post updated",
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error", error: error?.message})
    }
}
const updateImage = async (req, res) => {
    const {id} = req.params
    try {
        const file = req.file
        const fileUrl = await imageUploadService(file)
        await BlogPost.findByIdAndUpdate(id, {image: fileUrl})
        res.status(200).json({
            message: "Blog post image updated",
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error", error: error?.message})
    }
}
const deleteBlogPost = async (req, res) => {
    const {id} = req.params
    try {
        await BlogPost.findByIdAndDelete(id)
        res.status(200).json({
            message: "Blog post deleted",
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error", error: error?.message})
    }
}
const blogPostsSearch = async (req, res) => {
    const {q} = req.query;
    try {
        if (!/^[a-zA-Z0-9\s\-]+$/.test(q)) return res.status(400).json({error: 'Invalid search query'});
        const results = await BlogPost.find(
            {$text: {$search: q, $language: 'en'}},
            {score: {$meta: 'textScore'}},
        ).sort({score: {$meta: 'textScore'}});
        if (results.length === 0) return res.status(404).json({message: 'No post found matching the query'});
        res.status(200).json({
            message: 'Blog Posts retrieved successfully',
            blogPosts: results,
        });
    } catch (error) {
        res.status(500).json({message: "Internal server error", error: error?.message})
    }
};
export {createBlogPost, getBlogPost, getBlogPosts, updateBlogPost, deleteBlogPost, updateImage, blogPostsSearch}