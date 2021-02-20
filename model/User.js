const { Schema, model } = require("mongoose");
const { sign, verify } = require("jsonwebtoken");
const { compare, hash } = require("bcryptjs");
const AppError = require("../util/appErrorHandler");
const { getOne } = require("../Controllers/handleFactory");

const userSchema = Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    unique: [true, "email must be unique"],
    required: [true, "Please enter your email"],
  },
  password: {
    type: String,
    min: [8, "Password length should be betwee 8 and 20"],
    max: [20, "Password length should be betwee 8 and 20"],
    required: [true, "Please provide password"],
  },
  phone: {
    type: String,
    unique: [true, "phone already registered"],
    required: [true, "Please provide phone no"],
  },
  token: {
    type: String,
  },
  image: {
    type: String,
  },
});

userSchema.methods.generateToken = async function () {
  this.token = await sign({ id: this._id }, process.env.PRIVATE_KEY, {
    expiresIn: 60 * 10,
  });
};

userSchema.statics.findByEmailAndPassword = async function (email, password) {
  let userObj = null;
  try {
    return new Promise(async function (resolve, reject) {
      const user = await getOne(userModel, { email: email });

      if (!user) return reject(new AppError("Incorrect credentials", 404));
      userObj = user;
      const isMatched = await compare(password, user.password);

      if (!isMatched) return reject(new AppError("Incorrect credentials", 404));
      resolve(userObj);
    });
  } catch (err) {
    reject(err);
  }
};

userSchema.pre("save", async function (next) {
  var user = this;
  // Check whether password field is modified

  try {
    if (user.isModified("password")) {
      const hashPwd = await hash(this.password, 10);
      this.password = hashPwd;
      next();
    }
  } catch (err) {
    // return res.send({msg:err.message});
    console.log(err);
    next(err);
  }
});
userSchema.pre("updateOne", function (next) {
  this.options.runValidators = true;
  next();
});
userSchema.post("save", function (error, _, next) {
  //   console.log(error.name);
  //   console.log(error.message);
  //   console.log(error.code);
  //   console.log(error);

  if (error.code === 11000) {
    if (error.keyValue.email) next(new AppError("email is already resgisterd"));
    else next(new AppError("phone is already resgisterd"));
  } else if (error.name === "ValidationError") {
    let msg = [];
    error.message
      .split(",")
      .map((e) => msg.push(e.slice(e.lastIndexOf(":") + 1)));
    next(new AppError(msg.join(","), 404));
  }
});

const userModel = model("user", userSchema);

module.exports = userModel;
