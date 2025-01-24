import { Router } from "express";
import authRouter from "./authRoute.js";

const routes = Router();

routes.use("/auth", authRouter);
export default routes;