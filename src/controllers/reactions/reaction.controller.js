import BlogPost from "../../models/BlogPost.model.js";
import User from "../../models/User.model.js";
import {
  deleteBlogPostKeysFromRedis,
  deleteBlogPostsKeysFromRedis,
} from "../../utils/deleteBlogPostKeysFromRedis.js";
void User;

const getBlogReactions = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await BlogPost.findById(blogId, "reactionCounts");
    if (!blog) return res.status(404).json({ message: "Blog post not found" });
    const reactionCountsObj = Object.fromEntries(blog.reactionCounts);
    res.status(200).json({
      message: "Blog post reactions found",
      reactionCounts: Object.values(reactionCountsObj).reduce(
        (sum, value) => sum + value,
        0
      ),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};

const createReactToBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { reactionType } = req.body;
    const userId = req.user.id;
    const blog = await BlogPost.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog post not found" });
    const existingReactionIndex = blog.reactions.findIndex(
      (r) => r.user.toString() === userId.toString()
    );
    if (existingReactionIndex > -1) {
      const existingReaction = blog.reactions[existingReactionIndex];
      if (existingReaction.type === reactionType) {
        blog.reactions.splice(existingReactionIndex, 1);
        const currentCount = blog.reactionCounts.get(reactionType) || 0;
        blog.reactionCounts.set(reactionType, Math.max(currentCount - 1, 0));
      } else {
        const oldCount = blog.reactionCounts.get(existingReaction.type) || 0;
        blog.reactionCounts.set(
          existingReaction.type,
          Math.max(oldCount - 1, 0)
        );
        blog.reactions[existingReactionIndex].type = reactionType;
        const newCount = blog.reactionCounts.get(reactionType) || 0;
        blog.reactionCounts.set(reactionType, newCount + 1);
      }
    } else {
      blog.reactions.push({ type: reactionType, user: userId });
      const currentCount = blog.reactionCounts.get(reactionType) || 0;
      blog.reactionCounts.set(reactionType, currentCount + 1);
    }
    await blog.save();
    await deleteBlogPostKeysFromRedis(blogId);
    await deleteBlogPostsKeysFromRedis();
    res.status(200).json({
      message: "Reaction added successfully",
      reactions: blog.reactions,
      reactionCounts: Object.fromEntries(blog.reactionCounts),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
export { createReactToBlog, getBlogReactions };
