import joi from "joi";
const blogPostSchema = joi.object({
  title: joi.string().required().max(150),
  body: joi.string().required().min(50),
  tags: joi.array().items(joi.string()),
  author: joi.string().required(),
  category: joi.string().required(),
});
export default blogPostSchema;
