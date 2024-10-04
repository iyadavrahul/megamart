const jwt = require("jsonwebtoken");
const { error } = require("../apiResponse/apiResponse");
const { getText } = require("../language/lang");
const User = require("../models/userSchema");
async function tokenUserAuth(req, res, next) {
  const token = req.header("x-auth-token-user");
  if (!token)
    return res
      .status(401)
      .json(error("Access Denied. No token provided.", res.statusCode));
  try {
    // eslint-disable-next-line no-undef
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const user = await User.findById(req.user._id).lean();
    if (!user) {
      return res
        .status(401)
        .json(error(getText("SESSION", req.language), res.statusCode));
    }
    next();
  } catch (ex) {
    console.log(ex);
    return res
      .status(401)
      .json(error(getText("SESSION", req.language), res.statusCode));
  }
}
module.exports = tokenUserAuth;
