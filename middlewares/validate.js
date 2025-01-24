const validate = function (validationSchemas = {}) {
    return function (req, res, next) {
        const { body, params, query, headers } = validationSchemas;

        let validationResult;

        try {
            if (body) {
                validationResult = body.validate(req.body, { abortEarly: false });
                if (validationResult.error) throw validationResult.error;
            }

            if (params) {
                validationResult = params.validate(req.params, { abortEarly: false });
                if (validationResult.error) throw validationResult.error;
            }

            if (query) {
                validationResult = query.validate(req.query, { abortEarly: false });
                if (validationResult.error) throw validationResult.error;
            }

            if (headers) {
                validationResult = headers.validate(req.headers, { abortEarly: false });
                if (validationResult.error) throw validationResult.error;
            }

            // If all validations pass
            next();
        } catch (error) {
            // Catch validation errors and respond with a 400 status
            return res.status(400).json({ error: error.message });
        }
    };
};

export default validate;
