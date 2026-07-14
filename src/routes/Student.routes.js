import { Router  } from "express";
import { getStudent, addStudent, updateStudent, deleteStudent } from "../controller/student.controller.js";

const router = Router();

router.use(verifyJWT); // Apply JWT verification middleware to all routes

router.get("/Students", getStudent);
router.post("/Students", addStudent);
router.put("/Students/:id", updateStudent);
router.delete("/Students/:id", deleteStudent);

export default router;