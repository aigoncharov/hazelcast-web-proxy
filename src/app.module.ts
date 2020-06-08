import { Module } from '@nestjs/common'

import { MapsModule } from './maps/maps.module'
import { CoreModule } from './core/core.module'

@Module({
  imports: [CoreModule, MapsModule],
})
export class AppModule {}
