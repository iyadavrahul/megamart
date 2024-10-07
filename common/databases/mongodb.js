const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);
mongoose
  // eslint-disable-next-line no-undef
  .connect("mongodb+srv://starStaging:nQ2zYmu1APv9r8Yh@cluster0.llrjflg.mongodb.net/?retryWrites=true&w=majority&appName=aswaq", {
    maxPoolSize: 100,
  })
  .then(() => console.log("connected to MongoDB database"));
