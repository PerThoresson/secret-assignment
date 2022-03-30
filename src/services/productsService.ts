import { Article } from '@prisma/client'
import dbClient from '../db/client'
import NotFoundError from '../errors/NotFoundError'
import calculateAvailableQuantity from './calculateAvailableQuantity'

const getProducts = async (withIds?: number[]) => {
  const products = await dbClient.product.findMany({
    include: {
      articles: { select: { amountOf: true, article: true } }
    },
    where: { id: { in: withIds } }
  })

  const productsWithQuantity = products.map(product => ({
    ...product,
    quantity: calculateAvailableQuantity(product.articles)
  }))

  return productsWithQuantity
}

const productsService = () => {
  const addArticles = async (articlesData: Article[]) => {
    for (const article of articlesData) {
      await dbClient.article.upsert({
        where: { id: article.id },
        update: { stock: article.stock },
        create: article
      })
    }
  }

  const getAllProducts = async () => {
    const products = await getProducts()
    return products.map(product => {
      const { articles, ...rest } = product
      return rest
    })
  }

  const addProducts = async (
    productsData: {
      name: string
      price: number
      articles: { id: string; amountOf: number }[]
    }[]
  ) => {
    const productEntries = productsData.map(product => ({
      data: {
        name: product.name,
        price: product.price,
        articles: {
          create: product.articles.map(article => ({
            amountOf: article.amountOf,
            article: { connect: { id: article.id } }
          }))
        }
      }
    }))

    for (const entry of productEntries) {
      await dbClient.product.create(entry)
    }
  }

  const buyProducts = async (requestedProducts: { id: number; quantity: number }[]) => {
    const productIds = requestedProducts.map(product => product.id)

    const products = await getProducts(productIds)
    if (products.length < requestedProducts.length) {
      throw new NotFoundError('Product')
    }

    const articlesToPurchase = products
      .map(product => {
        const requestedQuantity = requestedProducts.find(p => p.id === product.id)?.quantity || 0
        const articlesToPurchase = product.articles || []

        return articlesToPurchase.map(article => ({
          id: article.article.id,
          amount: requestedQuantity * article.amountOf
        }))
      })
      .flat()

    await dbClient.$transaction(async transactionDbClient => {
      for (const article of articlesToPurchase) {
        const updatedArticle = await transactionDbClient.article.update({
          where: { id: article.id },
          data: { stock: { decrement: article.amount } }
        })
        if (updatedArticle.stock < 0) {
          throw new Error(`Article out of stock: ${updatedArticle.name}`)
        }
      }
    })
  }

  return { addArticles, getAllProducts, addProducts, buyProducts }
}

export default productsService
