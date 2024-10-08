const Category=require("../../models/category")
const SubCategory=require("../../models/subCategory")
const { success, error } = require("../../../../common/apiResponse/apiResponse");
const Error = require("common/models/errorSchema");



exports.addCategory = async (req, res) => {
    try {
      const { name_en, name_ar, description_en, description_ar, section } =
        req.body;
      if (!name_en) {
        return res
          .status(200)
          .json(error("Please provide english name", res.statusCode));
      }
      if (!name_ar) {
        return res
          .status(200)
          .json(error("Please provide arabic name", res.statusCode));
      }
      if (!description_en) {
        return res
          .status(200)
          .json(error("Please provide english description_en", res.statusCode));
      }
      if (!description_ar) {
        return res
          .status(200)
          .json(error("Please provide arabic description_en", res.statusCode));
      }
      const verify = await Category.findOne({ name_en: name_en });
      if (verify) {
        return res
          .status(201)
          .json(error("Category name already registered", res.statusCode));
      }
      const category = await Category.create({
        name_en,
        name_ar,
        // image: `${process.env.BASEURL}/${req.files[0].filename}`,
        description_ar,
        description_en,
        sectionId: section,
      });
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          if (req.files[i].fieldname == "image") {
            category.image = `${process.env.BASEURL}/${req.files[i].filename}`;
          }
        }
      }
      await category.save();
  
      res
        .status(200)
        .json(success("Category Added", { category }, res.statusCode));
    } catch (err) {
      console.log(err);
      await Error.create({
        // admin:admin,
        arrError: err,
        strError: err,
        objError: err,
        route: "category/addCategory",
      });
      res.status(400).json(error("Error", res.statusCode));
    }
  };


  exports.addSubCategory = async (req, res) => {
    try {
      const { name_en, name_ar, description_en, description_ar, category } =
        req.body;
      if (!name_en) {
        return res
          .status(200)
          .json(error("Please provide english name", res.statusCode));
      }
      if (!name_ar) {
        return res
          .status(200)
          .json(error("Please provide arabic name", res.statusCode));
      }
      if (!description_en) {
        return res
          .status(200)
          .json(error("Please provide english description_en", res.statusCode));
      }
      if (!description_ar) {
        return res
          .status(200)
          .json(error("Please provide arabic description_en", res.statusCode));
      }
      if (!category) {
        return res
          .status(200)
          .json(error("Please provide category", res.statusCode));
      }
      const verify = await SubCategory.findOne({ name_en: name_en });
      if (verify) {
        return res
          .status(201)
          .json(error("Sub category name already registered", res.statusCode));
      }
      const subCategory = await SubCategory.create({
        name_en,
        name_ar,
        // image: `${process.env.BASEURL}/${req.files[0].filename}`,
        description_ar,
        description_en,
        category,
      });
      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          if (req.files[i].fieldname == "image") {
            subCategory.image = `${process.env.BASEURL}/${req.files[i].filename}`;
          }
        }
      }
      await subCategory.save();
      res
        .status(200)
        .json(success("SubCategory Added", { subCategory }, res.statusCode));
    } catch (err) {
      console.log(err);
      await Error.create({
        // admin:admin,
        arrError: err,
        strError: err,
        objError: err,
        route: "category/addSubCategory",
      });
      res.status(400).json(error("Error", res.statusCode));
    }
  };