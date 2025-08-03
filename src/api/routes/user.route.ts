// src/routes/userRouter.ts

import express from "express";
import { userController } from "../controllers";
import accessControl from "../middlewares/accessControl";

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.get("/search", userController.searchUsers);
router.put("/:id", accessControl("ALL"), userController.editUser);
router.delete("/:id", accessControl("ALL"), userController.deleteUser);

export default router;
