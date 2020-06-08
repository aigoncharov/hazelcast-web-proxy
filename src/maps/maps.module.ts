import { Module } from '@nestjs/common'

import { MapsController } from './maps.controller'
import { MapsGateway } from './maps.gateway'
import { CoreModule } from '../core/core.module'
import { MapsService } from './maps.service'

@Module({
  imports: [CoreModule],
  controllers: [MapsController],
  providers: [MapsGateway, MapsService],
})
export class MapsModule {}
