const { validationResult } = require("express-validator");
const AppError = require("../util/appErrorHandler");

module.exports = {
  async executeValidation(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        // format error message // I want error message of kind to appear only once
        let paramStack = [];
        const filteredError = errors.errors
          .filter((err) => {
            if (!paramStack.includes(err.param)) {
              paramStack.push(err.param);
              return true;
            }
          })
          .map((filtered) => filtered.msg);

        return next(new AppError(filteredError.join(","), 400));
        // return res.status(403).send({
        //   errors: errors.array(),
        // });
      }

      next();
    } catch (err) {
      next(new AppError("Server Error", 500));
    }
  },
};
