import Comment from "../../models/Comment.model.js";
import commentSchema from "./comment.validator.js";

const createComment = async (req, res) => {
    const {error} = commentSchema.validate(req.body)
    if (error) return res.status(400).json({message: error.details[0].message})
    const {comment, blogPost, user} = req.body
    try {
        await new Comment({
            comment,
            blogPost,
            user
        }).save()
        res.status(200).json({message: "Comment created successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Something went wrong", error: error?.message});
    }
}
const getComments = async (req, res) => {
    try {
        const {blogId} = req.params
        const comments = await Comment.find({blogPost: blogId}).populate("user", "firstName")
        res.status(200).json({
            message: "Comments found",
            comments
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error", error: error?.message})
    }
}
const updateComment = async (req, res) => {
    const {id} = req.params
    try {
        await Comment.findByIdAndUpdate(id, req.body)
        res.status(200).json({
            message: "Comment updated",
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error", error: error?.message})
    }
}
const deleteComment = async (req, res) => {
    const {id} = req.params
    try {
        await Comment.findByIdAndDelete(id)
        res.status(200).json({
            message: "Comment deleted",
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error", error: error?.message})
    }
}
export {createComment, getComments, updateComment, deleteComment}
