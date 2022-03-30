import { Router } from 'express'

import ProductsController from '../controller/productsController'

const ProductsRoute = () => {
  const path = '/products'
  const router = Router()
  const productsController = ProductsController()

  router.get(path, productsController.getProducts)
  router.post(path, productsController.addProducts)
  router.put(`${path}/buy`, productsController.buyProducts)

  return { router }
}

export default ProductsRoute
