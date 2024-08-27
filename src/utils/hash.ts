import bcrypt from "bcrypt";

const saltRounds = 10;

export async function generateHash(password: string): Promise<string> 
{
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function checkPassword(
  password: string,
  hash: string
): Promise<boolean> 
{
  return bcrypt.compare(password, hash);
}