const { Router } = require("express");
const upload = require("../multer");

const {
  login,
  register,
  logout,
  getCurrentUserDetail,
} = require("../Controllers/userController");
const { Send } = require("../middleware/Send");
const { executeValidation } = require("../middleware/executeValidation");
const { checkValidation } = require("../middleware/validate");
const { authenticate } = require("../middleware/authentication");

const router = Router();

router.post("/register", [
  upload.single("userImage"),
  checkValidation("USER_REGISTRATION"),
  executeValidation,
  register,
  Send,
]);

router.get("/me", [authenticate, getCurrentUserDetail, Send]);
router.post("/login", [
  checkValidation("USER_LOGIN"),
  executeValidation,
  login,
  Send,
]);
router.delete("/logout", [authenticate, logout, Send]);

module.exports = router;
