const express = require("express");
const {
  testAPI,
  signup,
  login,
  verifyOTP,
  getUser,
  forgetPassword,
  updateUserPassword,
  changePassword,
  editUserProfile,
  changeLanguage,
} = require("../controller/user/auth");
const {
  adminSignup,
  adminLogin,
  adminForgetPassword,
  adminVerifyOtp,
  updatePassword,
  getAdminData,
  editProfile,
} = require("../controller/admin/admin");
const languageToken = require("common/middlewares/languageToken");
const { uploadUserImage } = require("common/helpers/uploadUserImage");
const tokenUserAuth = require("common/middlewares/tokenUserAuth");
const tokenAdminAuth = require("common/middlewares/tokenAdminAuth");
const router = express.Router();

//TODO -> User APIs
/**
 * @swagger
 * /auth/testAPI:
 *   patch:
 *     summary: this is test api
 *     tags: [Auth]
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

/**
 *@swagger
 *paths:
 *  /auth/signup:
 *    post:
 *      summary: User Signup
 *      tags: [Auth]
 *      description: Allows a new user to sign up with their details, including an optional profile image.
 *      parameters:
 *       - in: header
 *         name: x-auth-token-user
 *         required: true
 *         description: The authentication token for the user
 *         schema:
 *           type: string
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                fullName:
 *                  type: string
 *                  example: Rahul
 *                dateOfBirth:
 *                  type: string
 *                  format: date
 *                  example: 2024-12-12
 *                email:
 *                  type: string
 *                  format: email
 *                  example: rahulyadav@techgropse.com
 *                countryCode:
 *                  type: string
 *                  example: "91"
 *                phoneNumber:
 *                  type: string
 *                  example: "9876119876"
 *                gender:
 *                  type: string
 *                  enum: [Male, Female, Other]
 *                  example: Male
 *                password:
 *                  type: string
 *                  format: password
 *                  example: "12345678"
 *                image:
 *                  type: string
 *                  format: binary
 *      responses:
 *        '201':
 *          description: User successfully signed up
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                  results:
 *                    type: object
 *        '400':
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: Invalid input
 *        '500':
 *          description: Logo
 *          content:
 *            application/json:
 *             schema:
 *              type: object
 *              properties:
 *                error:
 *                  type: boolean
 *                message:
 *                  type: string
 *                results:
 *                  type: object
 *
 *      security:
 *        - x-auth-token-user: []
 *
 *      components:
 *        securitySchemes:
 *          x-auth-token-user:
 *            type: apiKey
 *            in: header
 *            name: x-auth-token-user
 *
 */
router.post("/signup", languageToken, uploadUserImage.any(), signup);
router.put("/login", languageToken, login);
router.patch("/verifyOTP", languageToken, verifyOTP);
router.patch("/forgetPassword", languageToken, forgetPassword);
router.patch("/updatePassword", languageToken, updateUserPassword);
router.patch("/changePassword", tokenUserAuth, changePassword);
router.get("/getUser", tokenUserAuth, getUser);
router.put(
  "/editProfile",
  tokenUserAuth,
  uploadUserImage.any(),
  editUserProfile,
);
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
router.put("/admin-login", adminLogin);
router.put("/admin-forgetPassword", adminForgetPassword);
router.put("/admin-verifyOTP", adminVerifyOtp);
router.put("/admin-updatePassword", updatePassword);
router.get("/getAdmin", tokenAdminAuth, getAdminData);
router.put("/editAdmin", tokenAdminAuth, editProfile);
module.exports = router;
