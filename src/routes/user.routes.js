const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controllers");

router.post("/create", userController.createUser);
router.get("/all", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/update/:id", userController.updateUser);
router.put("/update-multiple", userController.updateMultipleUsers);

module.exports = router;