import request from 'supertest'
import createServer from '../app'
import dbClient from '../db/client'

const clearDb = async () => {
  await dbClient.productArticle.deleteMany()
  await dbClient.article.deleteMany()
  await dbClient.product.deleteMany()
}

beforeAll(async () => {
  // Make sure DB is empty
  await clearDb()

  await dbClient.article.createMany({
    data: [
      {
        id: '1',
        name: 'leg',
        stock: 12
      },
      {
        id: '2',
        name: 'screw',
        stock: 17
      },
      {
        id: '3',
        name: 'seat',
        stock: 2
      },
      {
        id: '4',
        name: 'table top',
        stock: 1
      }
    ]
  })

  const products = [
    {
      name: 'Dining Chair',
      price: 39.99,
      articles: {
        create: [
          { amountOf: 4, article: { connect: { id: '1' } } },
          { amountOf: 8, article: { connect: { id: '2' } } },
          { amountOf: 1, article: { connect: { id: '3' } } }
        ]
      }
    },
    {
      name: 'Dining Table',
      price: 39.99,
      articles: {
        create: [
          { amountOf: 4, article: { connect: { id: '1' } } },
          { amountOf: 8, article: { connect: { id: '2' } } },
          { amountOf: 1, article: { connect: { id: '4' } } }
        ]
      }
    }
  ]

  for (const product of products) {
    await dbClient.product.create({ data: product })
  }
})

afterAll(async () => {
  await clearDb()
  await dbClient.$disconnect()
})

test('GET /products return correct quantity', async () => {
  const app = createServer()

  return request(app)
    .get(`/products`)
    .expect(200)
    .then(response => {
      expect(Array.isArray(response.body.data)).toBeTruthy()
      expect(response.body.data.length).toBe(2)
      expect(response.body.data[0].quantity).toBe(2)
    })
})

test('PUT /products/buy allows to buy and decreases stock', async () => {
  const app = createServer()

  const products = await dbClient.product.findMany()
  const productId = products[0].id

  await request(app)
    .put('/products/buy')
    .send({ products: [{ id: productId, quantity: 1 }] })
    .expect(200)

  return request(app)
    .get('/products')
    .expect(200)
    .then(response => {
      const product = response.body.data[0]
      expect(product.id).toBe(productId)
      expect(product.quantity).toBe(1)
    })
})
