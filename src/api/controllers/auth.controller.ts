import { Request, Response, NextFunction } from "express";
import { authService } from "../services";
import status from "http-status";

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      body: { email, password },
    } = req;
    const authBody = await authService.login({ email, password });
    res.status(status.OK).json(authBody);
  } catch (err) {
    next(err);
  }
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const account = await authService.register(body);
    res.status(status.CREATED).json(account);
  } catch (err) {
    next(err);
  }
};

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { email },
    } = req;

    const response = await authService.forgotPassword(email);

    res.status(status.OK).json(response);
  } catch (err) {
    next(err);
  }
};

const newPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      body: { password, email, token },
    } = req;
    const response = await authService.newPassword({ password, email, token });
    res.status(status.OK).json(response);
  } catch (err) {
    next(err);
  }
};

const verifyMail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      body: { email, code },
    } = req;
    const response = await authService.verifyMail({ email, code });
    res.status(status.OK).json(response);
  } catch (err) {
    next(err);
  }
};

const sendVerifyMail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      body: { email },
    } = req;

    const response = await authService.sendVerifyEmail(email);

    res.status(status.OK).json(response);
  } catch (err) {
    next(err);
  }
};
const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;
    const tokens = await authService.refreshToken(token);
    res.json(tokens);
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  register,
  verifyMail,
  forgotPassword,
  newPassword,
  sendVerifyMail,
  refreshToken,
};
