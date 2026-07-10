import express from "express";
const app=express();
const PORT=3000;  
const students=[
    {id:1,name:"John Doe",age:20},
    {id:2,name:"raj",age:22},
    {id:3,name:"Bob Johnson",age:19}
]
app.get("/students",(req,res) => {
    res.json(students);
});
app.get("/students/:id/:name",(req,res) => {console.log(req.params);
});
app.listen(PORT, () => {console.log(`Server running on http://localhost:${PORT}`);


});
app.get("/students",(req,res)=> {console.log(req.query);
});
