import { Router } from 'express'

import ArticlesController from '../controller/articlesController'

const ProductsRoute = () => {
  const path = '/articles'
  const router = Router()
  const articlesController = ArticlesController()

  router.post(path, articlesController.addArticles)

  return { router }
}

export default ProductsRoute
