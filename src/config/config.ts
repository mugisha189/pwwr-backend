import dotenv from "dotenv";
import * as process from "process";

dotenv.config();

const config = {
  PORT: Number(process.env.PORT) || 5000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  BCRYPT_SALT: parseInt(process.env.BCRYPT_SALT || "12"),
  ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET || "pwwr1234",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  APP_URL: process.env.APP_URL || "http://localhost:9000",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export default config;
