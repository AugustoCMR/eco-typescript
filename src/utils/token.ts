import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!; 

interface JwtPayload {
  customerId: number;
  email: string;
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function validateToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}

