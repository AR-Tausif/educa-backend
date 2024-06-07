import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  frontend_origin: process.env.FRONTEND_ORIGIN,
  local_database_url: process.env.LOCAL_DATABASE_URL,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
  jwt_access_secret_token: process.env.JWT_ACCESS_SECRET_TOKEN,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_Access_Expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_Refresh_Expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
};
