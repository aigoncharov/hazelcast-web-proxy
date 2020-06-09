export class EntityNotFoundError extends Error {
  constructor(type: string, name: string) {
    super(`${type} ${name} is not found.`)
  }
}
