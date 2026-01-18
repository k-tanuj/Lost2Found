const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        return res.status(400).json({ error: errorMessage });
    }
    next();
};

const schemas = {
    item: Joi.object({
        title: Joi.string().required().min(3).max(100),
        description: Joi.string().required().max(1000),
        location: Joi.string().required(),
        category: Joi.string().required(),
        type: Joi.string().valid('lost', 'found').required(),
        imageUrl: Joi.string().uri().allow(''),
        date: Joi.string().isoDate(),
        contact: Joi.string().allow('')
    }),
    claim: Joi.object({
        itemId: Joi.string().required(),
        message: Joi.string().max(500).allow(''),
        proof: Joi.string().min(5).max(1000).allow('')
    }),
    notification: Joi.object({
        userId: Joi.string().required(),
        type: Joi.string().required(),
        title: Joi.string().required(),
        message: Joi.string().required(),
        itemId: Joi.string().allow(''),
        relatedUserId: Joi.string().allow('')
    })
};

module.exports = { validate, schemas };
