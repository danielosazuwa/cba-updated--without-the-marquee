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

const authAdminVal = (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string() .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
      password: Joi.string().required(),
    });
  
    const { error } = schema.validate(req.body);
    createResponse(error, res, next);
};

const createAdminVal = (req, res, next) => {
    const schema = Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      role: Joi.string().required(),
      email: Joi.string() .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
      password: Joi.string().required(),
    });
  
    const { error } = schema.validate(req.body);
    createResponse(error, res, next);
};

module.exports = {
    authAdminVal,
    createAdminVal
}