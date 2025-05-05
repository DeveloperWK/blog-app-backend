import Category from "../../models/category.model.js";

const createCategory = async (req,res) => {
const {name,parent} = req.body
    try {
        const category = await new Category({
            name,
            parent
        })
        await category.save()
        res.status(200).json({
            message:"Category created successfully"
        })
    }catch (error) {
    console.error(error)
    res.status(500).json({message:"Internal server error",error:error?.message})
    }
}
const getCategories = async (req,res) => {
try {
    const categories = await Category.find()
    res.status(200).json({
        message:"Categories found",
        categories
    })
}catch (error) {
    console.error(error)
    res.status(500).json({message:"Internal server error",error:error?.message})
}
}
const updateCategory = async (req,res) => {
const {id} = req.params
    try {
        await Category.findByIdAndUpdate(id,req.body)
        res.status(200).json({
            message:"Category updated successfully"
        })
    }catch (error) {
    console.error(error)
    res.status(500).json({message:"Internal server error",error:error?.message})
    }
}
const deleteCategory = async (req,res) => {
const {id} = req.params
    try {
        await Category.findByIdAndDelete(id)
        res.status(200).json({
            message:"Category deleted successfully"
        })
    }catch (error) {
    console.error(error)
    res.status(500).json({message:"Internal server error",error:error?.message})
    }
}
export {createCategory,getCategories,updateCategory,deleteCategory}