const Joi = require("joi");

const createResponse = (error, res, next) => {
  if (error) {
      // error.details[0].code = 001;
    return res.status(400).json({
      status: "fail",
      message: error.details[0].message,
      data: error.details[0],
    });
  }
  next();
};

const isBigIntString = (value) => {
  return typeof value === "string" && /^\d+$/.test(value);
};

const courseVal = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string(),
    description: Joi.string().required(),
    who_list: Joi.array().required(),
    why_list: Joi.array().required(),
    amount_in_NGN: Joi.string()
      .custom((value, helpers) => {
        if (!isBigIntString(value)) {
          return helpers.error("any.invalid");
        }
        return BigInt(value);
      })
      .optional()
      .allow(null),
    amount_in_GBP: Joi.string()
      .custom((value, helpers) => {
        if (!isBigIntString(value)) {
          return helpers.error("any.invalid");
        }
        return BigInt(value);
      })
      .optional()
      .allow(null),
    amount_in_USD: Joi.string()
      .custom((value, helpers) => {
        if (!isBigIntString(value)) {
          return helpers.error("any.invalid");
        }
        return BigInt(value);
      })
      .optional()
      .allow(null),
    duration: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  console.log(error);
  createResponse(error, res, next);
};

module.exports = {
  courseVal,
};
