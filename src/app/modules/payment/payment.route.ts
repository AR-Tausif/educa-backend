import { Router } from "express";
import { StudentPaymentController } from "./payment.controller";
import validateRequest from "../../middlewares/validateRequest";
import { PaymentValidation } from "./payment.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.constant";

const router = Router();
router.post(
  "/create-payment",
  validateRequest(PaymentValidation.createClassValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentPaymentController.createStudentPaymentIntoDB
);
router.get(
  "/",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentPaymentController.getAllStudentPaymentIntoDB
);

// get single student payment info
router.get(
  "/:classId/:studentId",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentPaymentController.getSingleStudentPaymentInfoByStudentIdAndClassID
);

// get single student payment history
router.get(
  "/single-history/:classId/:studentId",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentPaymentController.getSingleStudentPaymentHistoryInfoByStudentIdAndClassID
);
router.patch(
  "/update-student-payment",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  StudentPaymentController.updateStudentPaymentIntoDB
);

router.get(
  "/due/:classId/:studentId",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  // StudentPaymentController.getDueOfStudent
  StudentPaymentController.getNagaOfStudent
);
// router.get(
//   "/due/:studentId",
//   auth(USER_ROLE.superAdmin, USER_ROLE.admin),
//   StudentPaymentController.getNagaOfStudent
// );
export const StudentPaymentRoutes = router;
