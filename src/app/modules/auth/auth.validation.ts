import { z } from "zod";

const UserValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    role: z.enum(["superAdmin", "admin", "teacher", "user"]).optional(),
  }),
});

const ChangePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: "current Password is require",
    }),
    newPassword: z.string({ required_error: "New Password is require" }),
  }),
});

const LoginValidationSchema = z.object({
  body: z.object({
    username: z.string({ required_error: "username is required" }),
    password: z.string({ required_error: "password is required " }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required!",
    }),
  }),
});

export const AuthValidation = {
  UserValidationSchema,
  ChangePasswordValidationSchema,
  LoginValidationSchema,
  refreshTokenValidationSchema,
};
