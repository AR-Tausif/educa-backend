import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../auth/auth.constant";
import { PaymentHistoryController } from "./paymentHistory.controller";

const router = Router();

router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  PaymentHistoryController.getAllPaymentHistoryFromDB
);

export const PaymentHistoryRouter = router;
