import mongoose, { model, Schema } from "mongoose";
const bookMarkSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "BlogPost", required: true },
  },
  { timestamps: true }
);

const BookMark = mongoose.models.BookMark || model("BookMark", bookMarkSchema);
export default BookMark;
