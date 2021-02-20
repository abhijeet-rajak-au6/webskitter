const { addPost, getUserPost } = require("../Controllers/postController");
const { Send } = require("../middleware/Send");
const { executeValidation } = require("../middleware/executeValidation");
const { checkValidation } = require("../middleware/validate");
const { authenticate } = require("../middleware/authentication");
const { Router } = require("express");
const router = Router();

router.post("/add-post", [
  authenticate,
  checkValidation("ADD_POST"),
  executeValidation,
  addPost,
  Send,
]);

router.get("/get-user-post", [authenticate, getUserPost, Send]);

module.exports = router;
