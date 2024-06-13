import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./auth.constant";

const router = express.Router();

router.post("/register", AuthController.createUser);
router.post("/login", AuthController.LoginUser);

// ==================

// router.post("/change-password", AuthController.UserChangePassword);
router.post(
  "/change-password",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AuthController.UserChangePassword
);

router.post(
  "/refresh-token",
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken
);

export const AuthRoutes = router;
