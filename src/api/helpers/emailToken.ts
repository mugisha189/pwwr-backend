import prisma from "../helpers/prisma";
import config from "../../config/config";
import bcrypt from "bcryptjs";
import APIError from "./APIError";
import status from "http-status";
import { TokenType } from "../interfaces/Token";

export async function generateAppToken(
  email: string,
  tokenType: TokenType
): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new APIError(status.BAD_REQUEST, "User does not exist");
  }
  await prisma.token.deleteMany({
    where: { email, type: tokenType },
  });
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedToken = bcrypt.hashSync(token, config.BCRYPT_SALT);
  await prisma.token.create({
    data: {
      email,
      token: hashedToken,
      type: tokenType,
      expireAt: new Date(Date.now() + 60 * 60 * 1000), 
    },
  });

  return token;
}

export async function generateVerificationCode(email: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new APIError(status.BAD_REQUEST, "User does not exist");
  }
  await prisma.token.deleteMany({
    where: { email, type: "VERIFY_EMAIL" },
  });
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedToken = bcrypt.hashSync(token, config.BCRYPT_SALT);
  await prisma.token.create({
    data: {
      email,
      token: hashedToken,
      type: "VERIFY_EMAIL",
      expireAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });
  return token;
}

export async function verifyAppToken(
  email: string,
  token: string,
  type: TokenType
): Promise<string | null> {
  const tokenRecord = await prisma.token.findFirst({
    where: { email, type },
  });
  if (!tokenRecord) return null;
  try {
    const isValid = await bcrypt.compare(token, tokenRecord.token);
    await prisma.token.delete({ where: { id: tokenRecord.id } });
    return isValid ? token : null;
  } catch {
    await prisma.token.delete({ where: { id: tokenRecord.id } });
    return null;
  }
}
