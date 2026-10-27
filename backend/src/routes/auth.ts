import bcrypt from "bcrypt";
import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { HttpError } from "../lib/errors";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/token";
import { requireAuth } from "../middleware/auth";
import { loginSchema, registerSchema } from "../validation";

const router = Router();
const publicUser = { id: true, name: true, email: true } as const;

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new HttpError(409, "An account with this email already exists");

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email, passwordHash }, select: publicUser });

    res.status(201).json({ token: signToken(user.id), user });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    const valid = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !valid) throw new HttpError(401, "Incorrect email or password");

    res.json({ token: signToken(user.id), user: { id: user.id, name: user.name, email: user.email } });
  })
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: publicUser });
    if (!user) throw new HttpError(401, "Your account no longer exists");
    res.json({ user });
  })
);

export default router;
