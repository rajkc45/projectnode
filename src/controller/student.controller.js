const students=[
    {id:1,name:"John Doe",age:20},
    {id:2,name:"raj",age:22},
    {id:3,name:"Bob Johnson",age:19}
]
const addStudent = (req, res) => {
    const newStudent = req.body;
    students.push(newStudent);
    
    res.json({
        message: "Student added successfully",
        students,
    });
};

const updateStudent = (req, res) => {
    const id = Number(req.params.id);
    const index = students.findIndex(student => student.id === id);

    if (index === -1) {
        return res.json({ message: "Student not found" });
    }

    const updatedStudent = { ...students[index], ...req.body };
    students[index] = updatedStudent;

    res.json({
        message: "Student updated successfully",
        students
    });
};

const deleteStudent = (req, res) => {
    const id = Number(req.params.id);
    const index = students.findIndex(student => student.id === id);

    if (index === -1) {
        return res.json({ message: "Student not found" });
    }

    students.splice(index, 1);

    res.json({
        message: "Student deleted successfully",
        students
    });
};
const getStudent = (req, res) => {
    console.log(req.query);

    const { name } = req.query;

    if (name) {
        const filteredStudents = students.filter(
            student => student.name.toLowerCase() === name.toLowerCase()
        );
        return res.json(filteredStudents);
    }

    res.json(students);
};

export { getStudent, addStudent, updateStudent, deleteStudent };    