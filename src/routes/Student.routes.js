import { Router  } from "express";
import { getStudent, addStudent, updateStudent, deleteStudent } from "../controller/student.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.get("/students", getStudent);

router.use(verifyJWT); // Apply JWT verification middleware to all routes


router.post("/students", addStudent);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

export default router;