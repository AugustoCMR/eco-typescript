import { NextFunction, Request, Response } from 'express'
import { ApiError } from '../helpers/api-erros'
import { ZodError } from 'zod'

export const errorMiddleware = (
	error: Error & Partial<ApiError>,
	req: Request,
	res: Response,
	next: NextFunction
) => {

    if(error instanceof ZodError)
    {
        res.status(400).json({ error: error.issues[0].message });
    }

	const statusCode = error.statusCode ?? 500
	const message = error.statusCode ? error.message : 'Internal Server Error'
	return res.status(statusCode).json({ message })
}