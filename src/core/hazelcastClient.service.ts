import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Client } from 'hazelcast-client'
import HazelcastClient from 'hazelcast-client/lib/HazelcastClient'

@Injectable()
export class HazelcastClientService implements OnModuleInit, OnModuleDestroy {
  private clientInternal!: HazelcastClient

  public get client() {
    return this.clientInternal
  }

  async onModuleInit(): Promise<void> {
    console.log('HazelcastClientService.onModuleInit')
    try {
      const clientConfig = new Config.ClientConfig()
      clientConfig.groupConfig.name = 'Cluster-1'

      this.clientInternal = await Client.newHazelcastClient(clientConfig)
      //this.clientInternal = await Client.newHazelcastClient()
    } catch (e) {
      console.error('HazelcastClientService.onModuleInit -> could not start client', e)
      process.exit(1)
    }
    console.log('HazelcastClientService.onModuleInit -> finished')
  }

  onModuleDestroy(): void {
    this.clientInternal.shutdown()
  }
}
