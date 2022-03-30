class NotFoundError extends Error {
  constructor(entity: string) {
    super(`${entity} not found`)
  }
}

export default NotFoundError
