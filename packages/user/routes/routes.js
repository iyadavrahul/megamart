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
router.patch("/getUsers",getUser)
/*
 * @swagger
 * /api/user/getUsers:
 *   patch:
 *     summary: Get the list of users
 *     description: Retrieve a list of users with optional search and date filters (year and month).
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               search:
 *                 type: string
 *                 description: Search for users by first name or email (optional).
 *               year:
 *                 type: integer
 *                 description: Filter users by year of creation (optional).
 *               month:
 *                 type: integer
 *                 description: Filter users by month of creation (optional, requires year).
 *     responses:
 *       200:
 *         description: List of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User list"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                             example: "John"
 *                           email:
 *                             type: string
 *                             example: "john@example.com"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-08-15T12:34:56Z"
 *       400:
 *         description: Error retrieving user list.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error in user list"
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 */


router.get("/userDetails/:id",tokenAdminAuth,getUserDetails)
router.delete("/userDelete/:id",tokenAdminAuth,userDelete)
router.post("/userStatus/:id",userStatus)
module.exports = router;
