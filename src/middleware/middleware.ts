import prisma from "../db/client";
import asyncHandler from "express-async-handler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUsuario } from "../types/types";
import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: IUsuario;
    }
  }
}

interface DecodedToken extends JwtPayload {
  userId: number;
}

const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.jwt;
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.FIRMA as string
        ) as DecodedToken;
        console.log(decoded);

        req.user = (await prisma.usuario.findUnique({
          where: { id_usuario: decoded.userId },
          // select: { clave: false },
        })) as IUsuario;

        if (!req.user) {
          res.status(401);
          throw new Error("No autorizado, el usuario ya no existe.");
        }
      } catch (error) {
        res.status(401);
        throw new Error("No autorizado, token inválido o expirado.");
      }
    } else {
      res.status(401);
      throw new Error("No autorizado, token no proporcionado.");
    }
    next();
  }
);

export { authMiddleware };
