import config from "../config";
import { USER_ROLE } from "../modules/auth/auth.constant";
import { TUser } from "../modules/user/user.interface";
import UserModel from "../modules/user/user.model";

const superAdmin: TUser = {
  username: "super-admin",
  fullName: "Educa School",
  phoneNumber: 1700000004,
  email: "abc@gmail.com",
  password: config.super_admin_password as string,
  role: USER_ROLE.superAdmin,
  isDeleted: false,
  status: "active",
};

const seedSuperAdmin = async () => {
  const isSuperAdminExist = await UserModel.findOne({
    role: USER_ROLE.superAdmin,
  });

  if (!isSuperAdminExist) {
    await UserModel.create(superAdmin);
  }
};

export default seedSuperAdmin;
