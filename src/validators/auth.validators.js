import * as z from "zod";

 const RegisteredUserSchema =z.object({
    email:z.email("Invalid email address"),
    name: z
    .string()
    .min(3,"Name must be at least 2 characters")
    .max(50,"Name must be  at most 29 characters"),
    password: z
    .string()
    .min(8,"password must be atleast 8 characters")
    .max(50,"password must be at most 50 characters"),
    role: z.enum(["STUDENT", "TEACHER"]),

 });
 const LoginUserSchema = z.object({
    email:z.email("Invalid email address"),
    password: z
    .string()
    .min(8,"password must be atleast 8 characters")
    .max(50,"password must be at most 50 characters"),
 });

 export {RegisteredUserSchema,LoginUserSchema};