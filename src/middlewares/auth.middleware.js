import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import prisma from "../db/db.js";

export const verifyJWT = asyncHandler(
  async (req, _res, next) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
        console.log("token",token)

      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }
      if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new ApiError(500, "Internal Server Error");
      }

      const decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );

      const user = await prisma.user.findUnique({
        where: { id: Number(decodedToken.id) },
        select: {
          id: true,
          email: true,
        },
      });

      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(401, "Token expired");
      }

      throw new ApiError(401, "Invalid access token");
    }
  }
);