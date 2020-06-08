import { Module } from '@nestjs/common'

import { HazelcastClientService } from './hazlecastClient.service'

@Module({
  providers: [HazelcastClientService],
})
export class CoreModule {}
