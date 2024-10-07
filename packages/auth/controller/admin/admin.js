const {
  success,
  error,
} = require("../../../../common/apiResponse/apiResponse");
//const { getText } = require("../../../../common/language/lang");\
const validator = require("Validator");
const Admin = require("common/models/admin");
const moment = require("moment");
const sendMail = require("../../services/emailServices");

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
    // await admin.save();
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
    const verify = await Admin.findOne({
      $or: [{ name }, { email: name?.toLowerCase() }],
    });
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
        success("Logged In Successfully", { verify, token }, res.statusCode),
      );
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Error In Admin Login", res.statusCode));
  }
};

exports.adminForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(201)
        .json(error("Please provide email", res.statusCode));
    }
    if (!validator.isEmail(email)) {
      return res.status(201).json(error("Invalid email", res.statusCode));
    }
    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });
    if (!admin) {
      return res
        .status(200)
        .json(error("Email is not registered", res.statusCode));
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    var expire_time = (expire_time = moment(expire_time).add(5, "minutes"));
    await Admin.findByIdAndUpdate(admin._id, {
      otp: +otp,
      expire_time: expire_time,
    });

    await sendMail(
      email,
      "MegaMart Password Otp",
      `Your otp is ${otp} expire in 5 minute`,
    );

    res.status(201).json(success("OTP Sent", { otp, admin }, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("forget password error", res.statusCode));
  }
};

exports.adminVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email) {
      return res
        .status(201)
        .json(error("Please provide email", res.statusCode));
    }
    if (!validator.isEmail(email)) {
      return res.status(201).json(error("Invalid email", res.statusCode));
    }
    if (!otp) {
      return res.status(201).json(error("Please enter OTP", res.statusCode));
    }
    const verify = await Admin.findOne({ email: email.toLowerCase() });
    if (!verify) {
      return res
        .status(201)
        .json(error("Email is not registered", res.statusCode));
    }
    if (verify.otp !== +otp) {
      return res.status(201).json(error("Invalid OTP", res.statusCode));
    }
    if (new Date(verify.expire_time) < new Date()) {
      return res.status(200).json(error("OTP Expired", res.statusCode));
    }
    await Admin.findOneAndUpdate({ email: email.toLowerCase() }, { otp: "" });
    res.status(201).json(success("OTP Verified", {}, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Verify otp error", res.statusCode));
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
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
    if (!confirmPassword) {
      return res
        .status(200)
        .json(error("Please Provide confirmPassword", res.statusCode));
    }
    if (password != confirmPassword) {
      return res
        .status(201)
        .json(
          error("Password and ConfirmPassword Not Be Same", res.statusCode),
        );
    }
    const admin = await Admin.findOne({ email: email.toLowerCase() }).select(
      "password",
    );
    admin.password = password;
    await admin.save();
    await sendMail(
      email,
      "MegaMart",
      `Your Password Has Been Reset Successfully`,
    );
    res
      .status(201)
      .json(
        success("Password Updated Successfully", { admin }, res.statusCode),
      );
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Update password error", res.statusCode));
  }
};

exports.getAdminData = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (!admin) {
      res.status(201).json(error("Invalid Admin", res.statusCode));
    }
    res.status(200).json(success("Success", { admin }, res.statusCode));
  } catch (err) {
    res.status(400).json(error("Error In admin Details", res.statusCode));
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { name, email, mobileNumber } = req.body;
    const admin = await Admin.findById(req.admin._id);
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (mobileNumber) admin.mobileNumber = mobileNumber;
    if (req.files?.length) admin.image = req.files[0].location;
    await admin.save();
    res
      .status(200)
      .json(success("Profile Update Successful", { admin }, res.statusCode));
  } catch (err) {
    res.status(400).json(error("Error ", res.statusCode));
  }
};
