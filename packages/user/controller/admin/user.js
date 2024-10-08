const { success, error } = require("common/apiResponse/apiResponse");
const User = require("common/models/userSchema");
const Admin = require("common/models/admin");
const { default: mongoose } = require("mongoose");

exports.getUserList = async (req, res) => {
  try {
    const { search, year, month } = req.body;
    const query = {
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };
    if (year) {
      const startDate = new Date(year, month ? month - 1 : 0, 1); // Start of the month or year
      const endDate = new Date(year, month ? month : 12, 0, 23, 59, 59); // End of the month or year

      query.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const users = await User.aggregate([
      {
        $match: query,
      },
    ]);

    res.status(200).json(success("User list ", { users }, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(500).json(error("Internal Server Error", res.statusCode));
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.params.id) },
      },
      // {
      //   $lookup: {
      //     localField: "_id",
      //     foreignField: "user",
      //     from: "addresses",
      //     as: "address",
      //   },
      // },
      // { $unwind: "$address" },
    ]);
    res.status(200).json(success("Success", { user }, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Error In User Details", res.statusCode));
  }
};

exports.userDelete = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json(success("User Deleted", {}, res.statusCode));
  } catch (err) {
    res.status(400).json(error("Error In User ", res.statusCode));
  }
};

exports.userStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params._id).select("status");
    user.status = !user.status;
    await user.save();
    const msg = user.status ? "User Enabled" : "User Disabled";
    res.status(201).json(success(msg, { user }, res.statusCode));
  } catch (err) {
    console.log(err);
    res.status(400).json(error("Error userStatus", res.statusCode));
  }
};
