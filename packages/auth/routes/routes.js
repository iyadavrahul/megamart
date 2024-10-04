const express = require("express");
const {
  testAPI,
  signup,
  login,
  verifyOTP,
  getUser,
  forgetPassword,
  updatePassword,
  changePassword,
  editProfile,
  changeLanguage,
} = require("../controller/user/auth");
const { adminSignup } = require("../controller/admin/admin");
const languageToken = require("common/middlewares/languageToken");
const { uploadUserImage } = require("common/helpers/uploadUserImage");
const tokenUserAuth = require("common/middlewares/tokenUserAuth");

const router = express.Router();

//TODO -> User APIs
/**
 * @swagger
 * /user/testAPI:
 *   patch:
 *     summary: this is test api
 *     tags: [Users]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Logo
 *         content:
 *           application/json:
 *            schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *               results:
 *                 type: object
 *       500:
 *         description: Logo
 *         content:
 *           application/json:
 *            schema:
 *             type: object
 *             properties:
 *               error:
 *                 type: boolean
 *               message:
 *                 type: string
 *               results:
 *                 type: object
 */
router.get("/testAPI", testAPI);
router.post(
  "/signup",
  // createUserImagePath,
  languageToken,
  uploadUserImage.any(),
  signup,
);
router.put("/login", languageToken, login);
router.patch("/verifyOTP", languageToken, verifyOTP);
router.patch("/forgetPassword", languageToken, forgetPassword);
router.patch("/updatePassword", languageToken, updatePassword);
router.patch("/changePassword", tokenUserAuth, changePassword);
router.get("/getUser", tokenUserAuth, getUser);
router.put("/editProfile", tokenUserAuth, uploadUserImage.any(), editProfile);
router.patch("/changeLanguage", tokenUserAuth, changeLanguage);
// router.get("/logout", tokenUserAuth, logout);

//! Google auth
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] }),
// );
// router.get("/google-login", (req, res) => {
//   res.send('<h1>Home</h1><a href="/auth/google">Login with Google</a>');
// });
// router.get("/googleAuthUser", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.send(
//       `<h1>Hello ${req.user.displayName}</h1><p><img src="${req.user.photos[0].value}" /></p><a href="/logout">Logout</a>`,
//     );
//   } else {
//     res.redirect("/");
//   }
// });
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "/auth/googleAuthUser",
//     failureRedirect: "/",
//   }),
// );

//TODO -> Affiliate apis
router.get("/testAPI", testAPI);

//TODO -> Admin APIs
router.post("/admin-signup", adminSignup);
// router.post("/signup", signup);

module.exports = router;
