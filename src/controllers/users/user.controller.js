import User from "../../models/User.model.js";
import BlogPost from '../../models/BlogPost.model.js'

void BlogPost;
const getAllWriters = async (req, res) => {
    try {
        const {page} = req.query
        const pageSize = 20;
        const currentPage = Number(page) || 1;
        const skip = (currentPage - 1) * pageSize;

        const writers = await User
            .find({role: "writer"})
            .skip(skip)
            .limit(pageSize)
            .sort({createdAt: -1})
        const totalWriters = await User.countDocuments({role: "writer"})
        if (!totalWriters) return res.status(404).json({message: "Writers not found"})
        res.status(200).json({
            message: "Writers found",
            writers,
            currentPage,
            totalPages: Math.ceil(await User.countDocuments({role: "writer"}) / pageSize),
            totalWriters
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error", error: error?.message})
    }
}
const getUser = async (req, res) => {
    const {id} = req.params
    try {
        const user = await User.findById(id).select("-password -_id -otp -otpExpiry -otpSecret -encryptedTokenIv")
        if (!user) return res.status(404).json({message: "User not found"})
        res.status(200).json({
            message: "User found",
            user
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error", error: error?.message})
    }
}
const updateUser = async (req, res) => {
    const {id} = req.params
    try {
        const user = await User.findByIdAndUpdate(id, req.body)
        if (!user) return res.status(404).json({message: "User not found"})
        res.status(200).json({
            message: "User updated",
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error", error: error?.message})
    }
}
const deleteUser = async (req, res) => {
    const {id} = req.params
    try {
        await User.findByIdAndDelete(id)
        res.status(200).json({
            message: "User deleted",
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error", error: error?.message})
    }
}
const searchWriter = async (req, res) => {
    const {q} = req.query;
    if (!q || q.trim() === '') return res.status(400).json({error: 'Invalid search query'});
    try {
        const writer = await User.find({
            role: "writer",
            firstName: {$regex: q, $options: 'i'},
            lastName: {$regex: q, $options: 'i'}
        })
        res.status(200).json({
            message: 'Writers retrieved successfully',
            writers: writer,
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error", error: error?.message})
    }
}

export {getUser, updateUser, deleteUser, getAllWriters, searchWriter}
