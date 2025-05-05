import joi from 'joi';
const commentSchema = joi.object({
    comment:joi.string().required(),
    blogPost:joi.string().required(),
    user:joi.string().required()
});
export default commentSchema;