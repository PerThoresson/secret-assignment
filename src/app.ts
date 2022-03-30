import express from 'express'
import errorMiddleware from './middlewares/errorMiddleware'
import ProductsRoute from './routes/productsRoute'
import ArticlesRoute from './routes/articlesRoute'

export default () => {
  const app = express()

  app.use(express.json())

  app.use('/', ProductsRoute().router)
  app.use('/', ArticlesRoute().router)

  app.use(errorMiddleware)

  return app
}
