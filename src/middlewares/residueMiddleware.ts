import { Request, Response, NextFunction } from "express";
import { residueRepository } from "../repositories/residueRepository";

export async function validateName(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { nome } = req.body.residue;

    const checkName = await residueRepository.findOneBy({ nome });

    if (checkName) {
      return res
        .status(400)
        .json({ message: "O Resíduo informado já possuí cadastro" });
    }

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: `Ocorreu um erro interno do servidor: ${error}` });
  }
}
