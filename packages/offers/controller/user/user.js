const { success, error } = require("../../../../common/apiResponse/apiResponse");
const { getText } = require("../../../../common/language/lang");


exports.testAPI = async (req, res) => {
  try {
    console.log(req.body);
    res
      .status(201)
      .json(success(getText("TEST_API", req.language), {}, res.statusCode));
  } catch (err) {
    console.log(err)
    res.status(500).json(error("Internal Server Error", res.statusCode));
  }
};