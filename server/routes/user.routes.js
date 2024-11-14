import { Router } from "express";
import {getProfile, login, logout, register} from "../controller/user.comtroller.js"
import { isLoggedIn } from "../middleware/auth.middleware.js";

const router = Router()

router.post('/register', register);
router.post('/login', login);
router.get('/logout',register);
router.get('/me',isLoggedIn,getProfile);


export default router;