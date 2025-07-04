import express from 'express';
import { loginUser, logout, registerUser } from '../controller/userController.js';

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);

export default router;
