const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./Routes/userRoutes");
const postRoutes = require("./Routes/postRoutes");
var methodOverride = require("method-override");
dotenv.config();
require("./db");
const app = express();

app.use(methodOverride("_method"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(userRoutes);
app.use(postRoutes);

// if (process.env.NODE_ENV === "production") {
//   console.log("hello");
//   app.use(express.static("client/build"));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

app.use((error, req, res, next) => {
  if (error.message.includes("user validation failed"))
    error.message = error.message.slice(error.message.indexOf(":"));

  // console.log(error.message);
  return res.status(error.statusCode || 500).send({
    message: error.message,
  });
});

const PORT = process.env.PORT || 1234;

app.listen(PORT, () => {
  // console.log(path.resolve(__dirname,"F.E","build","index.html"));

  console.log("Server is running at port " + PORT);
});
