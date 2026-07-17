import { Router } from "express";
import { registerUser,loginUser,refreshAccessToken  } from "../controller/User.Controller.js";

const router =Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

export default  router;
