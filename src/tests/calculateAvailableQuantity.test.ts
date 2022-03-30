import calculateAvailableQuantity from '../services/calculateAvailableQuantity'

test('Should set quantity based on least available article', () => {
  const productArticles = [
    { article: { stock: 15 }, amountOf: 5 },
    { article: { stock: 5 }, amountOf: 4 }
  ]
  expect(calculateAvailableQuantity(productArticles)).toBe(1)
})

test('Should set correct quantity if stock and amount is equal', () => {
  const productArticles = [
    { article: { stock: 15 }, amountOf: 5 },
    { article: { stock: 5 }, amountOf: 5 }
  ]
  expect(calculateAvailableQuantity(productArticles)).toBe(1)
})

test('Should set quantity to 0 if stock is less than amountOf', () => {
  const productArticles = [
    { article: { stock: 15 }, amountOf: 5 },
    { article: { stock: 4 }, amountOf: 5 }
  ]
  expect(calculateAvailableQuantity(productArticles)).toBe(0)
})
