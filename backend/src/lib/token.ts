import jwt from "jsonwebtoken";
import { config } from "../config";

export const signToken = (userId: string) => jwt.sign({}, config.jwtSecret, { subject: userId, expiresIn: "7d" });
