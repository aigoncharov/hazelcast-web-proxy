import { EntityNotFoundError } from './entityNotFound.error'

export class MapNotFoundError extends EntityNotFoundError {
  constructor(name: string) {
    super('Map', name)
  }
}
