import Joi from 'joi';

const tagValidation = Joi.object({
  name: Joi.string()
    .min(2)
    .max(30)
    .required()
    .messages({
      'string.empty': 'Tag name is required',
      'string.min': 'Tag name must be at least 2 characters',
      'string.max': 'Tag name must not exceed 30 characters',
    }),
});

export default tagValidation;
