import express from "express";
import { ClassController } from "./class.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { ClassValidation } from "./class.validation";
import { USER_ROLE } from "../auth/auth.constant";

const router = express.Router();

router.get("/", ClassController.getAllClassFromDB);
router.get("/:classId", ClassController.getSingleClassById);

router.post(
  "/create-class",
  auth(USER_ROLE.superAdmin),
  validateRequest(ClassValidation.createClassValidation),
  ClassController.createClassIntoDB
);
router.put(
  "/:classId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(ClassValidation.createClassValidation),
  ClassController.updateClassByIdIntoDB
);

router.delete(
  "/:classId",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  ClassController.deleteSingleClassById
);
export const ClassRoutes = router;
