/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import express, { Application, NextFunction, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import router from "./app/routes";
import NotFound from "./app/middlewares/NotFound";
import GlobalErrorHandler from "./app/middlewares/globalErrorhandler";
import httpStatus from "http-status";
import config from "./app/config";

// parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const origins = config.frontend_origin?.split(" ");

app.use(
  cors({
    origin: origins,
    credentials: true,
  })
);
// app.use("/uploads", express.static("uploads"));

// ========================
// application routes
// ========================
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send(`Educa-International-School server is running`);
});

app.use(GlobalErrorHandler);
app.use(NotFound);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND",
  });
});

export default app;
