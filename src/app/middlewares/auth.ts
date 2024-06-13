import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppErrors";
import catchAsync from "../utils/catchAsync";
import { TUserRole } from "../modules/user/user.interface";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You Are Not Authorized");
    }

    try {
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
      const role = decoded.role;

      if (
        requiredRoles.length > 0 &&
        !requiredRoles.includes(role as TUserRole)
      ) {
        throw new AppError(httpStatus.FORBIDDEN, "You Are Not Authorized");
      }

      req.username = decoded;
      next();
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You Are Not Authorized");
    }
  });
};

export default auth;
