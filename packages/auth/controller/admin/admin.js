const { success, error } = require("../../../../common/apiResponse/apiResponse");
//const { getText } = require("../../../../common/language/lang");\
const validator=require("Validator")
const Admin=require("../../models/admin")


exports.adminSignup = async (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email) {
        return res
          .status(201)
          .json(error("Please provide email", res.statusCode));
      }
      if (!validator.isEmail(email)) {
        return res.status(201).json(error("Invalid email", res.statusCode));
      }
      if (!password) {
        return res
          .status(201)
          .json(error("Please provide password", res.statusCode));
      }
      const verifyAdmin = await Admin.findOne({ email: email.toLowerCase() });
      if (verifyAdmin) {
        return res
          .status(201)
          .json(error("Email is already registered", res.statusCode));
      }
  
      const admin = await Admin.create({
        email: email.toLowerCase(),
        password: password,
        name: name,
      });
      await admin.save();
      res
        .status(201)
        .json(success("Signup Successful", { admin }, res.statusCode));
    } catch (err) {
      console.log(err);
      res.status(400).json(error("Error in signup", res.statusCode));
    }
  };


  exports.adminLogin = async (req, res) => {
    try {
      const { name, password } = req.body;
      if (!password) {
        return res
          .status(201)
          .json(error("Please provide password", res.statusCode));
      }
      const verify = await Admin.findOne({ $or: [{ name }, { email: name }] });
      if (!verify) {
        return res
          .status(201)
          .json(error("Admin is not registered", res.statusCode));
      }
      if (!(await verify.correctPassword(verify.password, password))) {
        return res.status(201).json(error("Invalid Password", res.statusCode));
      }
      const token = await verify.generateAdminAuthToken();
      res
        .header("x-auth-token-admin", token)
        .header("access-control-expose-headers", "x-auth-token-admin")
        .status(201)
        .json(
          success("Logged In Successfully", { verify, token }, res.statusCode)
        );
    } catch (err) {
      console.log(err);
      res.status(400).json(error("Error In Admin Login", res.statusCode));
    }
  };