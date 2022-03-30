export default (productArticles: { article: { stock: number }; amountOf: number }[]) => {
  if (productArticles.length === 0) return 0

  return productArticles.reduce((quantity, productArticle) => {
    const quantityBasedOnCurrentArticle = Math.floor(
      productArticle.article.stock / productArticle.amountOf
    )
    return Math.min(quantity, quantityBasedOnCurrentArticle)
  }, Number.MAX_SAFE_INTEGER)
}
