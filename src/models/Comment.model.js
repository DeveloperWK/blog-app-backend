import mongoose, { Schema, model } from 'mongoose';
const CommentSchema = new Schema({
    comment:String,
    blogPost:{
        type:Schema.Types.ObjectId,
        ref:'BlogPost',
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})
const Comment =
    mongoose.models.comment || model('Comment', CommentSchema);
export default Comment;
