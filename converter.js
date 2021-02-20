// const DataUri = require("datauri");
const path = require("path");
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const AppError = require("./util/appErrorHandler");

module.exports = function (originalName, buffer) {
  console.log("in convertor");
  try {
    let extension = path.extname(originalName);
    return parser.format(extension, buffer).content;
  } catch (err) {
    throw err;
  }
};
