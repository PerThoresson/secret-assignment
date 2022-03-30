import { NextFunction, Request, Response } from 'express'
import ProductsService from '../services/productsService'

const ProductsController = () => {
  const productsService = ProductsService()

  const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allProducts = await productsService.getAllProducts()
      res.status(200).json({ data: allProducts })
    } catch (error) {
      next(error)
    }
  }

  const addProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productsData = req.body as ProductsData
      const parsedData = productsData.products.map(product => ({
        ...product,
        articles: product.contain_articles.map(article => ({
          id: article.art_id,
          amountOf: parseInt(article.amount_of, 10)
        }))
      }))
      await productsService.addProducts(parsedData)
      res.status(201).send()
    } catch (error) {
      next(error)
    }
  }

  const buyProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productsData = req.body.products
      await productsService.buyProducts(productsData)
      res.status(200).send()
    } catch (error) {
      next(error)
    }
  }

  return { getProducts, addProducts, buyProducts }
}

export default ProductsController
