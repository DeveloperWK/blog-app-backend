import mongoose, {model, Schema} from 'mongoose'

const reactionTypes = ['like', 'love', 'funny', 'insightful'];
const ReactionSchema = new Schema({
    type: {
        type: String,
        enum: reactionTypes,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {_id: false})
const BlogPostSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },
    body: {
        type: String,
        required: true,
        minlength: 50
    },
    image: {
        type: String,
        default: '',
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    reactions: {
        type: [ReactionSchema],
        default: []
    },
    reactionCounts: {
        type: Map,
        of: Number,
        default: {}
    }

}, {timestamps: true})
BlogPostSchema.index(
    {
        title: 'text',
        body: 'text',
    },
    {
        weights: {
            title: 10,
            body: 1,
        },
        name: 'blogPostSearch',
    },
);
const BlogPost = mongoose.models.BlogPost || model('BlogPost', BlogPostSchema)
export default BlogPost
