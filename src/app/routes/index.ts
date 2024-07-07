import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { StudentRoutes } from "../modules/student/student.route";
import { ClassRoutes } from "../modules/class/class.route";
import { StudentPaymentRoutes } from "../modules/payment/payment.route";
import { AcademicPaymentRoutes } from "../modules/academic-payment/academic.payment.route";
import { PaymentHistoryRouter } from "../modules/paymentHistory/payemntHistory.route";
import { ReportRouter } from "../modules/report/report.route";

const router = Router();

// ============
// SUPER_ADMIN_PASSWORD=EDUCA-admin-12
// username: "super-admin",
// email: "abc@gmail.com",
// ============

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/class",
    route: ClassRoutes,
  },
  {
    path: "/student",
    route: StudentRoutes,
  },
  {
    path: "/academic-payment",
    route: AcademicPaymentRoutes,
  },
  {
    path: "/student-payment",
    route: StudentPaymentRoutes,
  },
  {
    path: "/payment-history",
    route: PaymentHistoryRouter,
  },
  {
    path: "/report",
    route: ReportRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
