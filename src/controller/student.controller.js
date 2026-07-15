import prisma from "../db/db.js";

const addStudent = async(req, res) => {
    try{
        const { name, email, password,role } = req.body;
        const newStudent = await prisma.user.create({
            data: {
                name,
                email,
                password,
                role,
            },
        });
    
        res.json({
            message: "Student added successfully",
            student: newStudent,
        });
    } catch (error) {
      console.log("error from addStudent controller: ", error);
        res.status(500).json({
            message: "Error adding student",
        });
    }
};


const updateStudent = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const student = await prisma.user.update({
      where: { id },
      data: req.body,
    });

    res.json({
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existing = await prisma.user.findUnique({ where: { id } });

    if (existing) {
      await prisma.user.delete({
        where: { id },
      });

      res.json({
        message: "Student deleted successfully",
      });
    } else {
      throw new Error("this id doesnt exists");
    }
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while deleting student: " + error.message,
    });
  }
};

const getStudent = async (req, res) => {
  try {
    const { name } = req.query;

    const students = await prisma.user.findMany({
      where: name
        ? {
            name: {
              equals: name,
              mode: "insensitive",
            },
          }
        : {},
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export { getStudent, addStudent, updateStudent, deleteStudent };    