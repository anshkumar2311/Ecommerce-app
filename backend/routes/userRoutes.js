import express from 'express';
import { registerUser } from '../controller/userController.js';

const router = express.Router();

router.route("/register").post(registerUser);

export default router;
