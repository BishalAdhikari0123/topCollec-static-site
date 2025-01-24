import Joi from 'joi';

const postValidation = Joi.object({
  title: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title must not exceed 200 characters',
    }),
  content: Joi.string()
    .min(20)
    .required()
    .messages({
      'string.empty': 'Content is required',
      'string.min': 'Content must be at least 20 characters',
    }),
  author: Joi.string()
    .required()
    .messages({
      'string.empty': 'Author is required',
    }),
  category: Joi.string()
    .max(50)
    .required()
    .messages({
      'string.empty': 'Category is required',
      'string.max': 'Category must not exceed 50 characters',
    }),
  tags: Joi.array()
    .items(
      Joi.string().max(30).messages({
        'string.max': 'Each tag must not exceed 30 characters',
      })
    )
    .optional(),
  published: Joi.boolean().optional(),
  publishedAt: Joi.date().optional(),
});

export default postValidation;
