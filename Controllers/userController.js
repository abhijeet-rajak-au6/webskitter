const AppError = require("../util/appErrorHandler");
const { createOne, getOne, uploadImage } = require("./handleFactory");
const Response = require("../util/responseHandler");

const userModel = require("../model/User");

module.exports = {
  async register(req, _, next) {
    try {
      //payload
      const { password, email, name, phone } = req.body;
      let secure_url;

      // check for image file
      if (req.file) {
        secure_url = await uploadImage(req.file.originalname, req.file.buffer);
      }

      //   create user
      const newUser = await createOne(userModel, {
        password,
        email,
        name,
        phone,
        image: secure_url || null,
      });

      if (!newUser) {
        throw new AppError("user not registered please try again !", 400);
      }
      req.locals = new Response("user regsitered sucessfully", 200);

      // generate response
      next();
    } catch (err) {
      //   console.log(err);
      next(new AppError(err.message, err.statusCode || 500));
    }
  },
  async login(req, _, next) {
    try {
      //payload
      const { password, email } = req.body;

      // find email and password
      const user = await userModel.findByEmailAndPassword(email, password);
      // generate token
      user.generateToken();

      // save the token
      await user.save({ validateBeforeSave: false });

      // response
      req.locals = new Response(`Welcome ${user.name}`, 200, {
        token: user.token,
      });
      next();
    } catch (err) {
      next(new AppError(err.message, err.statusCode));
    }
  },

  async logout(req, _, next) {
    try {
      const currentUser = req.user.id;
      condition = { _id: currentUser };
      const user = await getOne(userModel, condition);
      if (user) {
        user.token = null;

        await user.save({ validateBeforeSave: false });
        req.locals = new Response("Thank you visit again", 200);
        next();
      }
      throw new AppError("Session expired", 400);
    } catch (err) {
      next(new AppError(err.message, err.statusCode));
    }
  },
  async getCurrentUserDetail(req, _, next) {
    try {
      // init query and attributes
      const query = { _id: req.user.id };
      const attributes = { password: 0, __v: 0, token: 0 };

      // get user
      const user = await getOne(userModel, query, attributes);

      // check user is present
      if (!user) {
        throw new AppError("User not found !", 404);
      }
      //resposnse
      req.locals = new Response("User details", 200, { user });
      next();
    } catch (err) {
      next(new AppError(err.message, err.statusCode));
    }
  },
};
