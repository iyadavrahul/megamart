const express = require("express");
const { testAPI } = require("../controller/user/user");

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

module.exports = router;
