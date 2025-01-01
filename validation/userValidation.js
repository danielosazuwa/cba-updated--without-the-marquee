const Joi = require("joi");

const createResponse = (error, res, next) => {
    if (error) {
    //   error.details[0].code = 001;
      return res.status(400).json({
        status: "fail",
        message: error.details[0].message,
        data: error.details[0],
      });
    }
    next();
};

const userVal = (req, res, next) => {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      ipAddress: Joi.string().optional(),
      region: Joi.string().optional(),
      countryCode: Joi.string().optional(),
      country: Joi.string().optional()
    });
  
    const { error } = schema.validate(req.body);
    createResponse(error, res, next);
};

module.exports = {
    userVal
}