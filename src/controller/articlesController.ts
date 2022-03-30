import { NextFunction, Request, Response } from 'express'
import ProductsService from '../services/productsService'

const ArticlesController = () => {
  const productsService = ProductsService()

  const addArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const articlesData = req.body as ArticlesData
      const parsedData = articlesData.articles.map(article => ({
        id: article.art_id,
        stock: parseInt(article.stock),
        name: article.name
      }))
      await productsService.addArticles(parsedData)
      res.status(201).send()
    } catch (error) {
      next(error)
    }
  }

  return { addArticles }
}

export default ArticlesController
