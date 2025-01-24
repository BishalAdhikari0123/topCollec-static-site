import Joi from 'joi';

const likeValidation = Joi.object({
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
});

export default likeValidation;
