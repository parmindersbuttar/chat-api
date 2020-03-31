
var Joi = require("joi");
var bcrypt = require("bcryptjs");


module.exports = {
  
  validateSignup(body) {
    const schema = Joi.object().keys({
      fullName: Joi.string().required(),
      organisationId: Joi.string().allow(''),
      gender: Joi.string().allow(''),
      phoneNumber: Joi.string().allow(''),
      address: Joi.string().required(),
      // phoneNumber: Joi.string().regex(/^\+(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$/).required().error(errors => {
      //   return {
      //     message: "Phone number should be in right format(eg:+1 555-555-5555)."
      //   };
      // }),
      password: Joi.string().regex(/(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)[0-9a-zA-Z!@#$%^&*()]*$/).required().error(errors => {
        return {
          message: "Password must contains at least 1 lowercase letter, 1 uppercase letter, and 1 digit. It will also allow for some special characters."
        };
      }),
      einNumber: Joi.string().allow(''),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipcode: Joi.string().regex(/^[0-9]{5}(?:-[0-9]{4})?$/).required().error(errors => {
        return {
          message: "Zip code should be in right format(eg:12345 or 12345-6789)."
        };
      }),
    });
    const { value, error } = Joi.validate(body, schema);
    if (error && error.details) {
      let data = {error: true, message: error.details[0].message };
      return data;
    } else {
        return value;
    }
  },
  updateprofile(body) {
    const schema = Joi.object().keys({
      fullName: Joi.string().required(),
      userId: Joi.string().required(),
      organisationId: Joi.string().allow(''),
      gender: Joi.string().allow(''),
      phoneNumber: Joi.string().allow(''),
      address: Joi.string().required(),
      einNumber: Joi.string().allow(''),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipcode: Joi.string().regex(/^[0-9]{5}(?:-[0-9]{4})?$/).required().error(errors => {
        return {
          message: "Zip code should be in right format(eg:12345 or 12345-6789)."
        };
      }),

    });
    const { value, error } = Joi.validate(body, schema);
    if (error && error.details) {
      let data = {error: true, message: error.details[0].message };
      return data;
    } else {
        return value;
    }
  }
};
