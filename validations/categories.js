import Joi from 'joi';

const categoryValidation = Joi.object({
  name: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Category name is required',
      'string.min': 'Category name must be at least 3 characters',
      'string.max': 'Category name must not exceed 50 characters',
    }),
  description: Joi.string()
    .max(250)
    .optional()
    .messages({
      'string.max': 'Description must not exceed 250 characters',
    }),
});

export default categoryValidation;
