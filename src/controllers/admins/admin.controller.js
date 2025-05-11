import BlogPost from "../../models/BlogPost.model.js";
import Comment from "../../models/Comment.model.js";
import User from "../../models/User.model.js";

void BlogPost;
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: "Users found",
      users,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err?.message });
  }
};
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate(
      "blogPost user",
      "title firstName lastName -_id"
    );
    res.status(200).json({
      message: "Comments found",
      comments,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err?.message });
  }
};
export { getAllComments, getAllUsers };
