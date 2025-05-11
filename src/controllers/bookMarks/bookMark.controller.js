import BookMark from "../../models/BookMark.model.js";

const addBookMark = async (req, res) => {
  const { user, post } = req.body;
  console.log(user, post);
  try {
    const bookmark = await new BookMark({ user, post }).save();
    res.status(200).json({ message: "Bookmark added successfully", bookmark });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const getAllBookMark = async (req, res) => {
  const { userId } = req.params;
  try {
    const bookmark = await BookMark.find({ user: userId }).populate(
      "post",
      "title body -_id"
    );
    res.status(200).json({ message: "Bookmark found", bookmark });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
const removeBookMark = async (req, res) => {
  const { blogId } = req.params;
  try {
    const bookmark = await BookMark.findOneAndDelete({ post: blogId });
    res
      .status(200)
      .json({ message: "Bookmark removed successfully", bookmark });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error?.message });
  }
};
export { addBookMark, getAllBookMark, removeBookMark };
