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
    this.clientInternal = await Client.newHazelcastClient()
  }

  onModuleDestroy(): void {
    this.clientInternal.shutdown()
  }
}
