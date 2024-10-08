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


  exports.getCategories = async (req, res) => {
    try {
      const { search, } = req.body;
      const query = {
        $or: [
          { name_en: { $regex: search, $options: "i" } },
          { description_en: { $regex: search, $options: "i" } },
        ],
      };
      
      const categories = await Category.aggregate([
        {
          $match: query,
        },
       {
        $sort:{
          createdAt:-1
        }
       }
      ]);
      res.status(200).json(success("Categories", { categories }, res.statusCode));
    } catch (err) {
      console.log(err);
      await Error.create({
        // admin:admin,
        arrError: err,
        strError: err,
        objError: err,
        route: "category/getCategories",
      });
      res.status(400).json(error("error", res.statusCode));
    }
  };
  exports.editCategory = async (req, res) => {
    try {
      const { name_en, name_ar, description_en, description_ar } = req.body;
      const category = await Category.findById(req.params.id);
      if (name_en) {
        category.name_en = name_en;
      }
      if (name_ar) {
        category.name_ar = name_ar;
      }
      if (description_en) {
        category.description_en = description_en;
      }
      if (description_ar) {
        category.description_ar = description_ar;
      }
      if (req.files.length) {
        category.image = `${process.env.BASEURL}/${req.files[0].filename}`;
      }
      await category.save();
      res
        .status(200)
        .json(success("Category Edited", { category }, res.statusCode));
    } catch (err) {
      console.log(err);
      await Error.create({
        // admin:admin,
        arrError: err,
        strError: err,
        objError: err,
        route: "category/editCategories/:id",
      });
      res.status(400).json(error("Error editCategory", res.statusCode));
    }
  };
  exports.viewCategory = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id)
      console.log(category);
      res.status(200).json(success("Category", { category }, res.statusCode));
    } catch (err) {
      console.log(err);
      await Error.create({
        // admin:admin,
        arrError: err,
        strError: err,
        objError: err,
        route: "category/viewCategories/:id",
      });
      res.status(400).json(error("error viewCategory", res.statusCode));
    }
  };




  exports.deleteCategory = async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.status(200).json(success("Category Deleted", {}, res.statusCode));
    } catch (err) {
      console.log(err);
      await Error.create({
        // admin:admin,
        arrError: err,
        strError: err,
        objError: err,
        route: "category/deleteCategories/:id",
      });
      res.status(400).json(error("error ", res.statusCode));
    }
  };
  
  exports.changeCategoryStatus = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id).select("status")
      category.status = !category.status;
      await category.save();
      const msg = category.status ? "Category Enabled" : "Category Disabled";
      res.status(201).json(success(msg, { category }, res.statusCode));
    } catch (err) {
      console.log(err);
      await Error.create({
        // admin:admin,
        arrError: err,
        strError: err,
        objError: err,
        route: "category/categoryStatus/:id",
      });
      res.status(400).json(error("error SUbCategory", res.statusCode));
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