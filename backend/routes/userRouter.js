import express from "express";
import {register,login,logout,getUserDetails} from "../controllers/userController.js";
import { isAuthorized } from "../middlewares/auth.js";
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/logout",isAuthorized,logout);
router.get("/getuser",isAuthorized,getUserDetails);

export default router;

