const isAdmin = (req, res, next) => {
  try {
    req.user.role === "admin"
      ? next()
      : res
          .status(401)
          .json({ message: "You are not authorized to perform this action" });
  } catch (error) {
    next(error);
  }
};
const isWriter = (req, res, next) => {
  try {
    req.user.role === "writer"
      ? next()
      : res
          .status(401)
          .json({ message: "You are not authorized to perform this action" });
  } catch (error) {
    next(error);
  }
};
export { isAdmin, isWriter };
