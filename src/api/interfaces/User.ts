import { User } from "@prisma/client";

export type NewUser = Omit<User, "role">;

export type LoginUser = Pick<User, "email" | "password">;

export type PublicUser = Omit<NewUser, "password">;
