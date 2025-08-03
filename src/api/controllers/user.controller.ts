// src/controllers/userController.ts

import { Request, Response, NextFunction } from "express";
import { userService } from "../services";
import status from "http-status";
import { IUserRequest } from "api/middlewares/accessControl";

const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();
    res.status(status.OK).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(status.OK).json(user);
  } catch (error) {
    next(error);
  }
};

const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
      return res
        .status(status.BAD_REQUEST)
        .json({ msg: "Invalid search query" });
    }
    const users = await userService.searchUsers(query);
    res.status(status.OK).json(users);
  } catch (error) {
    next(error);
  }
};

const editUser = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user?.id;
    const updateData = req.body;
    const updatedUser = await userService.editUser(id as any, updateData);
    res.status(status.OK).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user?.id;
    const response = await userService.deleteUser(id as any);
    res.status(status.OK).json(response);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllUsers,
  getUserById,
  searchUsers,
  editUser,
  deleteUser,
};
