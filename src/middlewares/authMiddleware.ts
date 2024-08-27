import { Request, Response, NextFunction } from "express";
import { validateToken } from "../utils/token";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Token not found" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }
  try {
    const decodedToken = validateToken(token);
    if (!decodedToken) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.body.customerId = decodedToken.customerId;
    req.body.email = decodedToken.email;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}