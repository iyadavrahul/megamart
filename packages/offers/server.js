// eslint-disable-next-line no-undef
global.__basedir = __dirname;
require("dotenv").config();
const app = require("./App");
require("common/databases/mongodb");
// eslint-disable-next-line no-undef
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Offer - listening on port ${port}...`);
});
