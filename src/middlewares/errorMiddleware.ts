import { NextFunction, Request, Response } from 'express'
import NotFoundError from '../errors/NotFoundError'

const getHttpStatus = (error: Error) => {
  if (error instanceof NotFoundError) {
    return 404
  }
  return 500
}

const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    const statusCode = getHttpStatus(error)
    const message = error.message

    console.error(`[${req.method}] ${req.path} StatusCode:: ${statusCode}, Message:: ${message}`)
    res.status(statusCode).json({ message })
  } catch (e) {
    next(e)
  }
}

export default errorMiddleware
