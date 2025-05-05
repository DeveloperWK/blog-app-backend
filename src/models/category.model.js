import mongoose, { model, Schema } from 'mongoose';
const categorySchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    },
        { timestamps: true },
);

const Category =
    mongoose.models.Category || model('Category', categorySchema);
export default Category;