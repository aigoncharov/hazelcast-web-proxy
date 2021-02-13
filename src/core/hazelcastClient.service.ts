import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { Client, Config } from 'hazelcast-client'
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
      this.clientInternal = await Client.newHazelcastClient()
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
