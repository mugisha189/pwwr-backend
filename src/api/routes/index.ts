import express, { Router } from "express";
import authRouter from "./auth.route";
import docsRouter from "./docs.route";
import userRouter from "./user.route";

const router = express.Router();

const routes: {
  path: string;
  route: Router;
}[] = [
  { path: "/auth", route: authRouter },
  { path: "/user", route: userRouter },
];

const devRoutes = [
  {
    path: "/docs",
    route: docsRouter,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

devRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
