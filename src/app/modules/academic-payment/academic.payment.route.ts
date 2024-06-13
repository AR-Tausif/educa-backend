import { Router } from "express";
import { StudentPaymentController } from "./academic.payment.controller";
import validateRequest from "../../middlewares/validateRequest";
import { PaymentValidation } from "./academic.payment.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.constant";

const router = Router();
router.post(
  "/create-payment",
  validateRequest(PaymentValidation.createAcademicPaymentValidationSchema),
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentPaymentController.createAcademicPaymentIntoDB
);
router.get("/", StudentPaymentController.getAcademicPaymentFromDB);

// Get Academic payment details by classId and year
router.get(
  "/:classId",
  StudentPaymentController.getAcademicPaymentByClassIdAndYear
);
router.put(
  "/_id",
  StudentPaymentController.updateAcademicPaymentById
);

export const AcademicPaymentRoutes = router;
