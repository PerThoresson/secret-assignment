type ProductsData = {
  products: {
    name: string
    price: number
    contain_articles: {
      art_id: string
      amount_of: string
    }[]
  }[]
}

type ArticlesData = {
  articles: {
    art_id: string
    name: string
    stock: string
  }[]
}
