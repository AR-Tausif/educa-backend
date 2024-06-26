import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.constant";
const router = express.Router();
// ==================
// changes next line
// only super admin show
router.get("/all-user", auth(USER_ROLE.superAdmin), UserController.getAllUser);
router.patch(
  "/edit-info",
  auth(USER_ROLE.superAdmin),
  UserController.editUserInfo
);
router.patch(
  "/make-admin/:userId",
  auth(USER_ROLE.superAdmin),
  UserController.makeAdminById
);
router.patch(
  "/remove-admin/:userId",
  auth(USER_ROLE.superAdmin),
  UserController.makeUserById
);
router.patch(
  "/blocking-user/:userId",
  auth(USER_ROLE.superAdmin),
  UserController.blockingUserById
);
router.patch(
  "/activate-user/:userId",
  auth(USER_ROLE.superAdmin),
  UserController.activatingUserById
);
router.delete(
  "/deleting-user/:userId",
  auth(USER_ROLE.superAdmin),
  UserController.deletingUserById
);
router.get(
  "/counting-document",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  UserController.countingDocument
);

export const UserRoutes = router;
