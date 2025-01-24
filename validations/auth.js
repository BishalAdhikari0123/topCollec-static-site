import Joi from 'joi';

const userValidation = {
  // Role-based validation for 'register'
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
      .valid("admin", "reader", "writer")
      .default("reader")
      .required()
      .messages({
        'any.only': 'Role must be either admin, reader, or writer',
        'string.empty': 'Role is required',
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

    // Conditional validation based on role
    // Admin-specific validation
    admin: Joi.when('role', {
      is: 'admin',
      then: Joi.object({
        permissions: Joi.array()
          .items(Joi.string().valid("manage_users", "manage_content"))
          .required()
          .messages({
            'array.base': 'Permissions should be an array of strings',
            'array.includes': 'Permissions must be valid',
            'array.empty': 'Permissions are required for admin',
          }),
      }),
      otherwise: Joi.object().forbidden(),
    }),

    // Writer-specific validation
    writer: Joi.when('role', {
      is: 'writer',
      then: Joi.object({
        portfolio: Joi.string()
          .uri()
          .optional()
          .messages({
            'string.uri': 'Portfolio URL must be a valid URI',
          }),
        expertise: Joi.string()
          .min(5)
          .optional()
          .messages({
            'string.min': 'Expertise must be at least 5 characters long',
          }),
      }),
      otherwise: Joi.object().forbidden(),
    }),

    // Reader-specific validation
    reader: Joi.when('role', {
      is: 'reader',
      then: Joi.object({
        preferences: Joi.array()
          .items(Joi.string().valid("fiction", "non-fiction", "comics"))
          .optional()
          .messages({
            'array.base': 'Preferences should be an array of strings',
            'array.includes': 'Preferences must be valid',
          }),
      }),
      otherwise: Joi.object().forbidden(),
    }),
  }),
};

export default userValidation;
