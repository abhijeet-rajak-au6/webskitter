const AppError = require("../util/appErrorHandler");
const cloudinary = require("../cloudinary");
const convert = require("../converter");

module.exports = {
  async createOne(Model, payload) {
    try {
      return Model.create({ ...payload });
    } catch (err) {
      new AppError(err.message, 500);
    }
  },
  async modifyOne(Model, set, condition) {
    try {
      return Model.updateOne({ ...condition }, { ...set }, { new: true });
    } catch (err) {
      new AppError(err.message, 500);
    }
  },
  async getOne(Model, query, attributes = "") {
    try {
      return Model.findOne(query, attributes);
    } catch (err) {
      new AppError(err.message, 500);
    }
  },
  async getAll(Model, page, limit, attributes) {
    try {
      const pageNo = page * 1 || 0;
      limit = limit * 1 || 0;
      const skip = (pageNo - 1) * limit;

      return Model.find({}).skip(skip).limit(limit).select(attributes);
    } catch (err) {
      new AppError(err.message, 500);
    }
  },

  async uploadImage(fileOrginalName, fileBuffer) {
    try {
      console.log("in upload image", fileOrginalName, fileBuffer);
      const imageContent = convert(fileOrginalName, fileBuffer);
      const image = await cloudinary.uploader.upload(imageContent);
      return image.secure_url;
    } catch (err) {
      throw err;
    }
  },
};
