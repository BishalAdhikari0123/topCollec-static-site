import Joi from 'joi';

const userValidation = {
  register: Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 3 characters',
        'string.max': 'Name must not exceed 50 characters',
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 8 characters long',
      }),
    role: Joi.string()
      .valid('admin', 'author', 'reader')
      .optional()
      .messages({
        'any.only': 'Role must be either admin, author, or reader',
      }),
    bio: Joi.string()
      .max(500)
      .optional()
      .messages({
        'string.max': 'Bio must not exceed 500 characters',
      }),
    profileImage: Joi.string()
      .uri()
      .optional()
      .messages({
        'string.uri': 'Invalid profile image URL',
      }),
  }),
};

export default userValidation;
