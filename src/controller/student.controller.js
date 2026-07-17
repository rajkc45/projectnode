import prisma from "../db/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

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
    
        return res
        .status(402)
        .json(new ApiResponse(402,newStudent,"student added sucessfully"))
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
    return res
    .status(500)
    .json(new ApiError(500,"error occured while updating")) };
  
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
    return res
    .status(501)
    .json(new ApiError(501, "Error occurred while deleting student"));
    };
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
    return res
      .status(500)
      .json(new ApiError(500, "Error occurred while fetching students"));
  }
};


export { getStudent, addStudent, updateStudent, deleteStudent };    