import express from "express";

import { register } from "../controller/user.controller.js";
import { login } from "../controller/user.controller.js";
import { logout } from "../controller/user.controller.js";
import { getProfile, updateProfile } from "../controller/user.controller.js";
import { verifyToken } from "../jwt/token.js";
import { validateRequest, userValidation, updateProfileValidation } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/sign-up", validateRequest(userValidation), register);
router.post("/sign-in", login);
router.get("/logout", logout);
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, validateRequest(updateProfileValidation), updateProfile);

export default router;
