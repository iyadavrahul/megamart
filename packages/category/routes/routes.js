const express = require("express");
const { testAPI } = require("../controller/user/user");
const { addCategory, addSubCategory, getCategories, editCategory, viewCategory, deleteCategory, changeCategoryStatus } = require("../controller/admin/category");
const {uploadUserImage}=require("common/helpers/uploadUserImage")
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

router.post("/addCategory", uploadUserImage.any(),addCategory)
router.patch("/getCategories",getCategories)
router.get("/viewCategories/:id",viewCategory)
router.put("/editCategories/:id",editCategory)
router.delete("/deleteCategories/:id",deleteCategory)
router.put("/categoryStatus/:id",changeCategoryStatus)
router.post("/addSubCategory", uploadUserImage.any(),addSubCategory)

module.exports = router;
