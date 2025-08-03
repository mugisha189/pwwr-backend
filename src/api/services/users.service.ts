import prisma from "../helpers/prisma";
import APIError from "../helpers/APIError";
import status from "http-status";

const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new APIError(status.NOT_FOUND, "User not found");
  }

  return user;
};

const searchUsers = async (query: string) => {
  return prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const editUser = async (id: string, updateData: Partial<any>) => {
  try {
    return await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,

        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch {
    throw new APIError(status.NOT_FOUND, "User not found");
  }
};

const deleteUser = async (id: string) => {
  try {
    await prisma.user.delete({ where: { id } });
    return { msg: "User deleted successfully" };
  } catch {
    throw new APIError(status.NOT_FOUND, "User not found");
  }
};

export default {
  getAllUsers,
  getUserById,
  searchUsers,
  editUser,
  deleteUser,
};
