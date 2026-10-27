import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { HttpError } from "../lib/errors";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Please sign in to continue"));
  }
  try {
    const payload = jwt.verify(header.slice(7), config.jwtSecret) as jwt.JwtPayload;
    if (!payload.sub) throw new Error("missing subject");
    req.userId = payload.sub;
    next();
  } catch {
    next(new HttpError(401, "Your session has expired. Please sign in again"));
  }
};
