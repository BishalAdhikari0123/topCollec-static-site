import Joi from 'joi';

const commentValidation = Joi.object({
  content: Joi.string()
    .min(1)
    .required()
    .messages({
      'string.empty': 'Content is required',
      'string.min': 'Content must be at least 1 character',
    }),
  post: Joi.string()
    .required()
    .messages({
      'string.empty': 'Post ID is required',
    }),
  user: Joi.string()
    .required()
    .messages({
      'string.empty': 'User ID is required',
    }),
  parentId: Joi.string()
    .optional()
    .messages({
      'string.empty': 'Parent comment ID must be a valid string',
    }),
});

export default commentValidation;
