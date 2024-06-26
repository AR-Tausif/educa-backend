import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../auth/auth.constant";
import { StudentValidation } from "./student.validation";
import { StudentController } from "./student.controller";

const router = express.Router();

router.post(
  "/create-student",
  // upload.array("images", 50),
  auth(USER_ROLE.superAdmin),

  StudentController.createStudent
);

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentController.getAllStudent
);

router.get(
  "/:studentId",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentController.getSingleStudent
);
router.get(
  "/class/:classId",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentController.getStudentsByClassIdFromDB
);
router.delete(
  "/:_id",
  auth(USER_ROLE.superAdmin),
  StudentController.deleteSingleStudent
);

router.put(
  "/:studentId",
  auth(USER_ROLE.superAdmin),
  validateRequest(StudentValidation.updateStudentValidationSchema),
  StudentController.updateSingleStudent
);

export const StudentRoutes = router;
