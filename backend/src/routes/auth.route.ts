import Router from "express";
import { login, logout, resetPassword, signup } from "../controllers/auth.controller";
import { verifyJwt } from "../middlewares/auth.middleware";

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(verifyJwt,logout);
router.route("/reset-password").patch(verifyJwt,resetPassword);

export default router;