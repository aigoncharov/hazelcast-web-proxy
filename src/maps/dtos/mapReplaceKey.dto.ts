import { IsObject } from 'class-validator'

export class MapReplaceKeyReqDTO {
  @IsObject()
  data!: object
}
