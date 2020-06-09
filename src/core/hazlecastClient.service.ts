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
    this.clientInternal = await Client.newHazelcastClient()
    console.log('HazelcastClientService.onModuleInit -> finished')
  }

  onModuleDestroy(): void {
    this.clientInternal.shutdown()
  }
}
