const { error, success } = require("common/apiResponse/apiResponse");
const { getText } = require("common/language/lang");

exports.addProduct = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);
    const {
      name_en,
      name_ar,
      description_en,
      description_ar,
      category,
      subCategory,
      subSubCategory,
      imagesApp,
      imagesWeb,
      price,
      discount,
      origin,
      hasVarients,
      isLive,
    } = req.body;
    if (!name_en) {
      return res
        .status(201)
        .json(error(getText("", req.language), res.statusCode));
    }
    // if (!name_ar) {
    //   return res
    //     .status(201)
    //     .json(error(getText("", req.language), res.statusCode));
    // }
    if (!description_en) {
      return res
        .status(201)
        .json(error(getText("", req.language), res.statusCode));
    }
    // if (!description_ar) {
    //   return res
    //     .status(201)
    //     .json(error(getText("", req.language), res.statusCode));
    // }
    if (!category) {
      return res
        .status(201)
        .json(error(getText("", req.language), res.statusCode));
    }
    if (!subCategory) {
      return res
        .status(201)
        .json(error(getText("", req.language), res.statusCode));
    }
    if (!subSubCategory) {
      return res
        .status(201)
        .json(error(getText("", req.language), res.statusCode));
    }
    if (!productImages) {
      return res
        .status(201)
        .json(error(getText("", req.language), res.statusCode));
    }
    if (!price) {
      return res
        .status(201)
        .json(error(getText("", req.language), res.statusCode));
    }
    if (!discount) {
      return res
        .status(201)
        .json(error(getText("", req.language), res.statusCode));
    }
    if (!origin) {
      return res
        .status(201)
        .json(error(getText("", req.language), res.statusCode));
    }
    // if (!attributes) {
    //   return res
    //     .status(201)
    //     .json(error(getText("", req.language), res.statusCode));
    // }
    // if (!values) {
    //   return res
    //     .status(201)
    //     .json(error(getText("", req.language), res.statusCode));
    // }
    // if (!varientImages) {
    //   return res
    //     .status(201)
    //     .json(error(getText("", req.language), res.statusCode));
    // }
    // if (!price) {
    //   return res
    //     .status(201)
    //     .json(error(getText("", req.language), res.statusCode));
    // }
    // if (!discountedPrice) {
    //   return res
    //     .status(201)
    //     .json(error(getText("", req.language), res.statusCode));
    // }
    // if(hasVarients){
    //   if(["true",true].includes(hasVarients)){
    //   }
    // }
    // if(!varients?.length){
    //   return res.status(201).json(error(getText("PROVIDE_VARIENTS",req.body),res.statusCode))
    // }
    res
      .status(201)
      .json(success(getText("SUCCESS", req.language), {}, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(500).json(error("Internal Server Error", res.statusCode));
  }
};
