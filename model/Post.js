const { Schema, model } = require("mongoose");

const AppError = require("../util/appErrorHandler");

const postSchema = Schema({
  title: {
    type: String,
    required: [true, "Please provide the post title"],
  },
  description: {
    type: String,
    required: [true, "Please provide the post description"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

postSchema.post("save", function (error, _, next) {
  console.log(error.name);
  console.log(error.message);
  console.log(error.code);

  if (error.code === 11000) {
    next(new AppError("email is already resgisterd"));
  } else if (error.name === "ValidationError") {
    let msg = [];
    error.message
      .split(",")
      .map((e) => msg.push(e.slice(e.lastIndexOf(":") + 1)));
    next(new AppError(msg.join(","), 404));
  }
});

const postModel = model("post", postSchema);

module.exports = postModel;
