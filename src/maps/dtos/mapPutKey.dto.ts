import { IsObject } from 'class-validator'

export class MapPutKeyReqDTO {
  @IsObject()
  data!: object
}
