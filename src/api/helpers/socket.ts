import { Server } from "socket.io";
import prisma from "../helpers/prisma";

const usersio: Record<string, any> = {};

export default function (io: Server) {
  io.on("connection", (socket: any) => {
    socket.on("setUserId", async (userId: string) => {
      if (userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user) {
          usersio[userId] = socket;
          console.log(`⚡ Socket: User with id ${userId} connected`);
        } else {
          console.log(`🚩 Socket: No user with id ${userId}`);
        }
      }
    });

    socket.on("disconnect", (userId: string) => {
      console.log(`🔥 user with id ${userId} disconnected from socket`);
      usersio[userId] = null;
    });
  });
}
