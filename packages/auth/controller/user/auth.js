const {
  success,
  error,
} = require("../../../../common/apiResponse/apiResponse");
const { getText } = require("../../../../common/language/lang");
const { isEmail } = require("validator");
const crypto = require("crypto");
const moment = require("moment");
const User = require("common/models/userSchema");
const Device = require("common/models/deviceSchema");
// require("dotenv").config();

exports.testAPI = async (req, res) => {
  try {
    console.log(req.body);
    res
      .status(201)
      .json(success(getText("TEST_API", req.language), {}, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(500).json(error("Internal Server Error", res.statusCode));
  }
};

exports.signup = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);
    const {
      fullName,
      email,
      countryCode,
      phoneNumber,
      password,
      dateOfBirth,
      gender,
    } = req.body;
    if (!fullName) {
      return res
        .status(200)
        .json(error(getText("FULL_NAME", req.language), res.statusCode));
    }
    if (!gender) {
      return res
        .status(200)
        .json(error(getText("GENDER", req.language), res.statusCode));
    }
    if (!dateOfBirth) {
      return res
        .status(200)
        .json(error(getText("DATE_OF_BIRTH", req.language), res.statusCode));
    }
    if (!email) {
      return res
        .status(200)
        .json(error(getText("PROVIDE_EMAIL", req.language), res.statusCode));
    }
    if (!isEmail(email)) {
      return res
        .status(200)
        .json(error(getText("INVALID_EMAIL", req.language), res.statusCode));
    }
    const checkEmail = await User.findOne({
      email: email.toLowerCase(),
    }).lean();
    if (checkEmail) {
      return res
        .status(200)
        .json(error(getText("DUPLICATE_EMAIL", req.language), res.statusCode));
    }
    if (!countryCode) {
      return res
        .status(200)
        .json(
          error(getText("PROVIDE_COUNTRYCODE", req.language), res.statusCode),
        );
    }
    if (!phoneNumber) {
      return res
        .status(200)
        .json(error(getText("PROVIDE_PHONE", req.language), res.statusCode));
    }
    const checkPhone = await User.findOne({
      countryCode: countryCode,
      phoneNumber: phoneNumber,
    });
    if (checkPhone) {
      return res
        .status(200)
        .json(error(getText("DUPLICATE_PHONE", req.language), res.statusCode));
    }
    if (!password) {
      return res
        .status(200)
        .json(error(getText("PROVIDE_PASSWORD", req.language), res.statusCode));
    }
    const otp = crypto.randomInt(100000, 999999);
    const expireTime = moment(new Date()).add(10, "minute");
    const user = await User.create({
      fullName: fullName,
      email: email.toLowerCase(),
      countryCode: countryCode,
      phoneNumber: phoneNumber,
      password: password,
      otp: otp,
      expireTime: new Date(expireTime),
      gender: gender,
      profileImage: req.files?.length
        ? // eslint-disable-next-line no-undef
          `${process.env.BASEURL}/${req.files[0].filename}`
        : "",
    });
    // sendSMS(
    //   countryCode.replace(/[0+]/g, "") + phoneNumber,
    //   getText("SIGNUP_OTP", req.language, { otp }),
    // );
    res
      .status(201)
      .json(
        success(getText("SIGNUP", req.language), { user, otp }, res.statusCode),
      );
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json(error(getText("CATCH_ERROR", req.language), res.statusCode));
  }
};

exports.login = async (req, res) => {
  try {
    const {
      countryCode,
      phoneNumber,
      email,
      password,
      deviceId,
      deviceOS,
      fcmToken,
      deviceName,
      OSVersion,
      buildNumber,
      language,
    } = req.body;
    console.log(req.body);
    if (!((phoneNumber && countryCode) || email)) {
      return res
        .status(200)
        .json(
          error(getText("PROVIDE_EMAIL_PHONE", req.language), res.statusCode),
        );
    }
    if (!password) {
      return res
        .status(200)
        .json(error(getText("PROVIDE_PASSWORD", req.language), res.statusCode));
    }
    const user = await User.findOne({
      $or: [
        { countryCode: countryCode, phoneNumber: phoneNumber },
        { email: email?.toLowerCase() },
      ],
    }).select([
      "fullName",
      "countryCode",
      "phoneNumber",
      "email",
      "password",
      "isVerified",
    ]);
    // .lean();
    if (!user) {
      const msg = email
        ? getText("UNREGISTERED_EMAIL", req.language)
        : getText("UNREGISTERED_PHONE", req.language);
      return res.status(200).json(error(msg, res.statusCode));
    }
    // console.log(user);
    // console.log(await user.checkUserPassword(password, user.password));
    if (!(await user.checkUserPassword(password, user.password))) {
      return res
        .status(200)
        .json(error(getText("INVALID_PASSWORD", req.language), res.statusCode));
    }
    if (!user.isVerified) {
      const otp = crypto.randomInt(100000, 999999);
      const expireTime = moment(new Date()).add(10, "minute");
      await User.findByIdAndUpdate(user._id, {
        otp: otp,
        expireTime: new Date(expireTime),
      });
      return res
        .status(200)
        .json(
          success(
            getText("VERIFY_PROFILE", req.language),
            { isVerified: false, otp },
            res.statusCode,
          ),
        );
    }
    const token = user.generateAuthToken();
    const device = await Device.findOne({ deviceId: deviceId });
    if (device) {
      await Device.findByIdAndUpdate(device._id, {
        fcmToken: fcmToken ?? "",
        authToken: token,
      });
    } else {
      await Device.create({
        user: user._id,
        deviceId: deviceId ?? "",
        deviceOS: deviceOS,
        fcmToken: fcmToken ?? "",
        authToken: token,
        deviceName: deviceName ?? "",
        OSVersion: OSVersion ?? "",
        buildNumber: buildNumber ?? "",
        language: language ? language : "English",
      });
    }
    // await sendNotificationUser(
    //   "LOGIN",
    //   { type: "LOGIN", userId: String(user._id), username: user?.firstName_en },
    //   user._id,
    // );
    res
      .status(201)
      .json(
        success(
          getText("LOGGED_IN", req.language),
          { token, user },
          res.statusCode,
        ),
      );
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json(error(getText("CATCH_ERROR", req.language), res.statusCode));
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    console.log(req.body);
    const {
      otp,
      countryCode,
      phoneNumber,
      email,
      deviceId,
      deviceOS,
      fcmToken,
      deviceName,
      OSVersion,
      buildNumber,
      language,
    } = req.body;
    if (!((phoneNumber && countryCode) || email)) {
      return res
        .status(200)
        .json(
          error(getText("PROVIDE_EMAIL_PHONE", req.language), res.statusCode),
        );
    }
    const user = await User.findOne({
      $or: [
        { countryCode: countryCode, phoneNumber: phoneNumber },
        { email: email?.toLowerCase() },
      ],
    }).select([
      "fullName",
      "countryCode",
      "phoneNumber",
      "email",
      "password",
      "otp",
    ]);
    if (!user) {
      const msg = email
        ? getText("UNREGISTERED_EMAIL", req.language)
        : getText("UNREGISTERED_PHONE", req.language);
      return res.status(200).json(error(msg, res.statusCode));
    }
    if (!otp) {
      return res
        .status(200)
        .json(error(getText("PROVIDE_OTP", req.language), res.statusCode));
    }
    if (user.otp !== +otp) {
      return res
        .status(200)
        .json(error(getText("INVALID_OTP", req.language), res.statusCode));
    }
    await User.findByIdAndUpdate(user._id, { isVerified: true, otp: "" });
    const token = user.generateAuthToken();
    const device = await Device.findOne({ deviceId: deviceId });
    if (device) {
      await Device.findByIdAndUpdate(device._id, {
        fcmToken: fcmToken ?? "",
        authToken: token,
      });
    } else {
      await Device.create({
        user: user._id,
        deviceId: deviceId ?? "",
        deviceOS: deviceOS,
        fcmToken: fcmToken ?? "",
        authToken: token,
        deviceName: deviceName ?? "",
        OSVersion: OSVersion ?? "",
        buildNumber: buildNumber ?? "",
        language: language ? language : "English",
      });
    }
    res
      .status(201)
      .json(
        success(
          getText("OTP_VERIFIED", req.language),
          { token },
          res.statusCode,
        ),
      );
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json(error(getText("CATCH_ERROR", req.language), res.statusCode));
  }
};

exports.forgetPassword = async (req, res) => {
  try {
    const { phoneNumber, countryCode } = req.body;
    console.log(req.body);
    if (!countryCode) {
      return res
        .status(200)
        .json(
          error(getText("PROVIDE_COUNTRYCODE", req.language), res.statusCode),
        );
    }
    if (!phoneNumber) {
      return res
        .status(200)
        .json(error(getText("PROVIDE_PHONE", req.language), res.statusCode));
    }
    const user = await User.findOne({
      countryCode: countryCode,
      phoneNumber: phoneNumber,
    });
    if (!user) {
      return res
        .status(200)
        .json(
          error(getText("UNREGISTERED_PHONE", req.language), res.statusCode),
        );
    }
    const otp = crypto.randomInt(1000, 9999);
    user.otp = otp;
    await user.save();
    res
      .status(201)
      .json(
        success(getText("OTP_SENT", req.language), { otp }, res.statusCode),
      );
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json(error(getText("CATCH_ERROR", req.language), res.statusCode));
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { phoneNumber, countryCode, password } = req.body;
    console.log(req.body);
    if (!password) {
      return res
        .status(200)
        .json(error(getText("PROVIDE_NEW_PASS", req.language), res.statusCode));
    }
    if (!countryCode) {
      return res
        .status(200)
        .json(
          error(getText("PROVIDE_COUNTRYCODE", req.language), res.statusCode),
        );
    }
    if (!phoneNumber) {
      return res
        .status(200)
        .json(error(getText("PROVIDE_PHONE", req.language), res.statusCode));
    }
    const user = await User.findOne({
      countryCode: countryCode,
      phoneNumber: phoneNumber,
    });
    if (!user) {
      return res
        .status(200)
        .json(
          error(getText("UNREGISTERED_PHONE", req.language), res.statusCode),
        );
    }
    user.password = password;
    await user.save();
    res
      .status(201)
      .json(
        success(getText("PASSWORD_UPDATED", req.language), {}, res.statusCode),
      );
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json(error(getText("CATCH_ERROR", req.language), res.statusCode));
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, password } = req.body;
    console.log(req.body);
    if (!oldPassword) {
      return res
        .status(206)
        .json(error(getText("PROVIDE_OLD_PASS", req.language), res.statusCode));
    }
    if (!password) {
      return res
        .status(206)
        .json(error(getText("PROVIDE_NEW_PASS", req.language), res.statusCode));
    }
    const user = await User.findById(req.user._id).select("password");
    if (!(await user.checkUserPassword(oldPassword, user.password))) {
      res
        .status(200)
        .json(error(getText("INVALID_PASSWORD", req.language), res.statusCode));
    }
    user.password = password;
    await user.save();
    res
      .status(201)
      .json(
        success(
          getText("PASSWORD_CHANGED", req.language),
          { user },
          res.statusCode,
        ),
      );
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json(error(getText("CATCH_ERROR", req.language), res.statusCode));
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select(["-otp", "-password"])
      .lean();
    res.status(201).json(success("User", { user }, res.statusCode));
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json(error(getText("CATCH_ERROR", req.language), res.statusCode));
  }
};

exports.editUser = async (req, res) => {
  try {
    const { firstName_en, lastName_en, firstName_ar, lastName_ar, email } =
      req.body;
    console.log(req.body);
    const user = await User.findById(req.user._id).select([
      "firstName_en",
      "lastName_en",
      "firstName_ar",
      "lastName_ar",
      "email",
      "image",
    ]);
    if (email) {
      if (user.email !== email) {
        const checkEmail = await User.findOne({ email: email.toLowerCase() });
        if (checkEmail) {
          return res
            .status(200)
            .json(
              success(
                getText("DUPLICATE_EMAIL", req.language),
                { user },
                res.statusCode,
              ),
            );
        }
        user.email = email;
      }
    }
    if (firstName_en) user.firstName_en = firstName_en;
    if (lastName_en) user.lastName_en = lastName_en;
    if (firstName_ar) user.firstName_ar = firstName_ar;
    if (lastName_ar) user.lastName_ar = lastName_ar;
    if (req.files?.length) user.image = req.files[0].location;
    await user.save();
    res
      .status(201)
      .json(
        success(
          getText("USER_UPDATED", req.language),
          { user },
          res.statusCode,
        ),
      );
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json(error(getText("CATCH_ERROR", req.language), res.statusCode));
  }
};

exports.changeLanguage = async (req, res) => {
  try {
    const { language, deviceId } = req.body;
    console.log(req.body);
    if (!deviceId) {
      return res
        .status(206)
        .json(error("Please provide deviceId", res.statusCode));
    }
    if (!language) {
      return res
        .status(206)
        .json(error("Please provide language", res.statusCode));
    }
    if (!["Arabic", "English"].includes(language)) {
      return res.status(206).json(error("Invalid language", res.statusCode));
    }
    const device = await Device.findOne({ deviceId: deviceId });
    if (!device) {
      return res.status(401).json(error("Please login again!", res.statusCode));
    }
    device.language = language;
    await device.save();
    res
      .status(201)
      .json(
        success(getText("CHANGE_LANGUAGE", req.language), {}, res.statusCode),
      );
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json(error(getText("CATCH_ERROR", req.language), res.statusCode));
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.header("x-auth-token-listener");
    await Device.findOneAndDelete({ user: req.user._id, authToken: token });
    res
      .status(201)
      .json(success(getText("LOGGED_OUT", req.language), {}, res.statusCode));
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json(error(getText("CATCH_ERROR", req.language), res.statusCode));
  }
};
