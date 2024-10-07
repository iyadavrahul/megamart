const express = require("express");
const { testAPI } = require("../controller/user/user");
const { getUser } = require("../../auth/controller/user/auth");
const tokenAdminAuth=require("common/middlewares/tokenAdminAuth");
const { getUserDetails, userDelete, userStatus } = require("../controller/admin/user");
const router = express.Router();

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
// router.post("/signup", signup);


//TODO -> Admin APIs
router.patch("/getUsers",tokenAdminAuth,getUser)
router.get("/userDetails/:id",tokenAdminAuth,getUserDetails)
router.delete("/userDelete/:id",tokenAdminAuth,userDelete)
router.post("/userStatus/:id",userStatus)
module.exports = router;
