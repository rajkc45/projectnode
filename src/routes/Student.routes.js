import { Router  } from "express";
import { getStudent, addStudent, updateStudent, deleteStudent } from "../controller/student.controller.js";

const router = Router();

// router.use(verifyJWT); // Apply JWT verification middleware to all routes

router.get("/students", getStudent);
router.post("/students", addStudent);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

export default router;