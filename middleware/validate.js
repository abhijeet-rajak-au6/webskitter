const { check, validationResult, query } = require("express-validator");

module.exports = {
  checkValidation(method) {
    switch (method) {
      case "USER_REGISTRATION":
        return [
          check("name")
            .not()
            .isEmpty()
            .withMessage("please provide name")
            .isLength({ min: 3, max: 20 })
            .withMessage("Length of name should be between 3 to 20"),
          check("email")
            .not()
            .isEmpty()
            .withMessage("please provide first name")
            .isEmail()
            .withMessage("please provide correct email"),
          check("password")
            .not()
            .isEmpty()
            .withMessage("please provide password")
            .isLength({ min: 8, max: 20 })
            .withMessage("Length of password should be between 8 to 20"),
          check("phone")
            .not()
            .isEmpty()
            .withMessage("Please Provide phone no")
            .isMobilePhone()
            .withMessage("Please enter a valid phone no "),
        ];
      case "USER_LOGIN":
        return [
          check("email")
            .not()
            .isEmpty()
            .withMessage("please provide email")
            .isEmail()
            .withMessage("please provide correct email"),
          check("password")
            .not()
            .isEmpty()
            .withMessage("please provide password")
            .isLength({ min: 8, max: 20 })
            .withMessage("Length of password should be between 8 to 20"),
        ];
      case "ADD_POST":
        return [
          check("title")
            .not()
            .isEmpty()
            .withMessage("please provide your post title"),
          check("description")
            .not()
            .isEmpty()
            .withMessage("please provide short description about the post")
            .isLength({ max: 30 })
            .withMessage("Description of post  should be within 3 leters"),
        ];

      default:
        return "Invalid Method";
    }
  },
};
