import { IsString, Length } from 'class-validator'
import { validationConstraints } from '../consts'

export class MapCreateDTO {
  @IsString()
  @Length(validationConstraints.mapName.minLength, validationConstraints.mapName.maxLength)
  name!: string
}
