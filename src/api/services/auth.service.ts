import prisma from "../helpers/prisma";
import APIError from "../helpers/APIError";
import status from "http-status";
import bcrypt from "bcryptjs";
import config from "../../config/config";
import { NewUser } from "../interfaces/User";
import {
  Payload,
  createAccessToken,
  createRefreshToken,
  verifyAuthToken,
} from "../helpers/authToken";
import {
  generateAppToken,
  generateVerificationCode,
  verifyAppToken,
} from "../helpers/emailToken";
import mailer from "../helpers/mailer";

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new APIError(status.UNAUTHORIZED, "User does not exist");

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword)
    throw new APIError(status.UNAUTHORIZED, "Incorrect password");

  const { password: _, ...userWithoutPassword } = user;

  return {
    accessToken: createAccessToken({ id: user.id, email: user.email }),
    refreshToken: createRefreshToken({ id: user.id, email: user.email }),
    user: userWithoutPassword,
  };
};

const refreshToken = async (token: string) => {
  const user = verifyAuthToken(token) as Payload;
  if (!user) throw new APIError(status.UNAUTHORIZED, "Unauthorized");

  return {
    accessToken: createAccessToken({ id: user.id, email: user.email }),
    refreshToken: createRefreshToken({ id: user.id, email: user.email }),
  };
};

const register = async (body: NewUser) => {
  const { email, password, name } = body;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }],
    },
  });

  if (existingUser) {
    throw new APIError(status.CONFLICT, "Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, config.BCRYPT_SALT);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      emailVerified: false,
    },
  });

  const token = await generateAppToken(newUser.email, "VERIFY_EMAIL");
  mailer.sendVerificationEmail(newUser.email, token);

  const { password: _, ...userWithoutPassword } = newUser;

  return {
    accessToken: createAccessToken({ id: newUser.id, email: newUser.email }),
    refreshToken: createRefreshToken({ id: newUser.id, email: newUser.email }),
    user: userWithoutPassword,
    msg: "Registration successful, please verify your email",
  };
};

const newPassword = async ({
  password,
  email,
  token,
}: {
  password: string;
  email: string;
  token: string;
}) => {
  const verified = await verifyAppToken(email, token, "PASSWORD_RESET");

  if (!verified) {
    throw new APIError(status.BAD_REQUEST, "Token invalid or expired");
  }

  const hashedPass = await bcrypt.hash(password, config.BCRYPT_SALT);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPass },
  });

  return { msg: "Password updated successfully" };
};

const forgotPassword = async (email: string) => {
  const token = await generateAppToken(email, "PASSWORD_RESET");
  mailer.sendPasswordResetEmail(email, token);
  return { msg: "Please check your email for the password reset link" };
};

const verifyMail = async ({ email, code }: { email: string; code: string }) => {
  const validToken = await verifyAppToken(email, code, "VERIFY_EMAIL");

  if (!validToken) {
    throw new APIError(status.BAD_REQUEST, "Token invalid or expired");
  }

  const user = await prisma.user.update({
    where: { email },
    data: { emailVerified: true },
  });

  const { password: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    msg: "Email verified successfully",
  };
};

const sendVerifyEmail = async (email: string) => {
  const code = await generateVerificationCode(email);
  mailer.sendVerificationEmail(email, code);
  return { msg: "The verification code sent successfully to the email" };
};

export default {
  login,
  register,
  forgotPassword,
  newPassword,
  verifyMail,
  sendVerifyEmail,
  refreshToken,
};
