export type TUserRole = "superAdmin" | "admin" | "user";
export type TStatus = "Active" | "Block";

interface PasswordChange {
  password: string;
  timestamp: Date;
}

export interface TUser {
  username?: string;
  fullName: string;
  phoneNumber: number;
  email?: string;
  password: string;
  role?: TUserRole;
  createdAt?: Date;
  updatedAt?: Date;
  currentPassword?: string;
  newPassword?: string;
  token?: string;
  isDeleted?: boolean;
  status?: "active" | "block" | "de-active";
  passwordChangedAt?: string;
  isJWTIssuedBeforePasswordChanged?: (
    passwordChangedAt: string,
    iat: number
  ) => boolean;
  passwordChangeHistory?: PasswordChange[];
}
