import { object, string } from "yup";

export const userInfoSchema = object({
    firstname: string().min(2).max(20).required(),
    lastname: string().min(2).max(20),
    email: string().email().required(),
    password: string().min(8).required(),
  }).required();
  
export const userSchema = object({
    email: string().email().required(),
    password: string().min(8).required(),
}).required();
