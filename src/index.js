import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import studentrouter from "./routes/Student.routes.js"; 

const app=express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/v1",studentrouter);

const PORT=3000;  
// const students=[
//     {id:1,name:"John Doe",age:20},
//     {id:2,name:"raj",age:22},
//     {id:3,name:"Bob Johnson",age:19}
// ]
// app.get("/students", (req, res) => {
//     console.log(req.query);

//     const { name } = req.query;

//     if (name) {
//         const filteredStudents = students.filter(
//             student => student.name.toLowerCase() === name.toLowerCase()
//         );
//         return res.json(filteredStudents);
//     }

//     res.json(students);
// });
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
app.get("/",(req,res) =>{
    // const newStudent=req.body;
    // students.push(newStudent);
    
    res.json({
        message:"Student added successfully",
        // students,
    });
});
// app.delete("/students/:id",(req,res) =>{
//     const id=Number(req.params.id);
//     const index = students.findIndex(student => student.id === id);

//     if (index === -1) {
//         return res.json({ message: "Student not found" });
//     }

//     students.splice(index, 1);

//     res.json({
//         message: "Student deleted successfully",
//         students
//     });
// }); 
