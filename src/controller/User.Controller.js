import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  RegisteredUserSchema,
  LoginUserSchema,
} from "../validators/auth.validators.js";
import prisma from "../db/db.js";
import bcrypt from "bcrypt";

// Token helpers

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

const generateAccessAndRefreshTokens = (userId) => {
  try {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new ApiError(500, "Something went wrong");
  }
};

// Password helpers

const encryptPassword = (password) => bcrypt.hash(password, 10);

const isPasswordCorrect = (password, hash) =>
  bcrypt.compare(password, hash);

// Controllers

const registerUser = asyncHandler(
  async (req, res) => {
    const result = RegisteredUserSchema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, "Invalid user data with errors", result.error);
    }

    const { name, email, password, role } = result.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ApiError(409, "An account with this email already exists");
    }
    
    const encryptedPassword = await encryptPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        password: encryptedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        refreshToken: true,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, user, "User registered successfully"));
  }
);

const loginUser = asyncHandler(
  async (req, res) => {
    const result = LoginUserSchema.safeParse(req.body);
    if (!result.success) {
      throw new ApiError(400, "Invalid user data");
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new ApiError(404, "No user found with this email");
    }

    const isPasswordValid = await isPasswordCorrect(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Incorrect password");
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshTokens(
      user.id
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const loggedInUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken, refreshToken },
          "Logged in successfully"
        )
      );
  }
);

const refreshAccessToken = asyncHandler(
  async (req, res) => {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Session expired. Please log in again.");
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new ApiError(500, "Internal Server Error");
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch {
      throw new ApiError(401, "Session expired. Please log in again.");
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(decodedToken.id) },
    });

    if (
      !user ||
      !user.refreshToken ||
      user.refreshToken !== incomingRefreshToken
    ) {
      throw new ApiError(401, "Session expired. Please log in again.");
    }

    const { accessToken, refreshToken } = generateAccessAndRefreshTokens(
      user.id
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Session refreshed successfully"
        )
      );
  }
);

export { registerUser, loginUser, refreshAccessToken };