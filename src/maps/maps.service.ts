import { Injectable, OnModuleDestroy, NotFoundException } from '@nestjs/common'
import { EntryEvent } from 'hazelcast-client/lib/core/EntryListener'
import { MapEvent } from 'hazelcast-client/lib/core/MapListener'
import { Subject } from 'rxjs'

import { HazelcastClientService } from '../core/hazelcastClient.service'
import { MapItemEventType, MapEntityEventType } from './consts'
import { MapNotFoundError } from '../core/errors/mapNotFound.error'

const mockMaps = [
  {
    getName: () => 'map-1',
  },
  {
    getName: () => 'map-2',
  },
]

@Injectable()
export class MapsService implements OnModuleDestroy {
  public readonly itemEvents$ = new Subject<{ mapName: string; event: MapItemEventType; data: EntryEvent<unknown, unknown> }>()
  public readonly entityEvents$ = new Subject<{ mapName: string; event: MapEntityEventType; data: MapEvent }>()

  private listeners = new Map<string, string>()

  constructor(private readonly hazelcastClientService: HazelcastClientService) {}

  async onModuleDestroy() {
    // TODO: Investigate how many listeners we can remove at once safely
    for (const listenerId of this.listeners.values()) {
      await this.hazelcastClientService.client.removeDistributedObjectListener(listenerId)
    }
  }

  async findAllMaps() {
    // https://github.com/hazelcast/hazelcast-nodejs-client/issues/539
    // https://github.com/hazelcast/hazelcast-nodejs-client/issues/538
    // const distributedObjects = await this.hazelcastClientService.client.getDistributedObjects()
    // const maps = distributedObjects.filter((item) => item.getServiceName() === 'map')
    // return maps
    return mockMaps
  }

  async findMap<K, V>(mapName: string) {
    const maps = await this.findAllMaps()

    if (!maps.find((map) => map.getName() === mapName)) {
      throw new MapNotFoundError(mapName)
    }

    const map = await this.hazelcastClientService.client.getMap<K, V>(mapName)
    return map
  }

  async createMap(mapName: string) {
    await this.hazelcastClientService.client.getMap(mapName)
    this.subscribeToMap(mapName)

    // TODO: Remove me
    mockMaps.push({
      getName: () => mapName,
    })
  }

  async deleteMap(mapName: string) {
    const map = await this.findMap(mapName)

    await map.destroy()

    this.listeners.delete(mapName)

    // TODO: Remove me
    const mapToRemove = mockMaps.findIndex((map) => map.getName() === mapName)
    mockMaps.splice(mapToRemove, 1)
  }

  async get<K, V>(mapName: string, key: K) {
    const map = await this.findMap<K, V>(mapName)
    return await map.get(key)
  }

  async create<K, V>(mapName: string, key: K, value: V) {
    const map = await this.findMap<K, V>(mapName)
    return await map.putIfAbsent(key, value)
  }

  async update<K, V>(mapName: string, key: K, value: V) {
    const map = await this.findMap<K, V>(mapName)
    return await map.put(key, value)
  }

  async delete<K, V>(mapName: string, key: K) {
    const map = await this.findMap<K, V>(mapName)
    await map.delete(key)
  }

  public async subscribeToMap<K, V>(mapName: string) {
    if (this.listeners.has(mapName)) {
      return
    }

    const map = await this.findMap<K, V>(mapName)

    const listenerId = await map.addEntryListener(
      {
        removed: (data) => this.itemEvents$.next({ mapName, event: MapItemEventType.Removed, data }),
        added: (data) => this.itemEvents$.next({ mapName, event: MapItemEventType.Added, data }),
        updated: (data) => this.itemEvents$.next({ mapName, event: MapItemEventType.Updated, data }),
        merged: (data) => this.itemEvents$.next({ mapName, event: MapItemEventType.Merged, data }),
        evicted: (data) => this.itemEvents$.next({ mapName, event: MapItemEventType.Evicted, data }),
        expired: (data) => this.itemEvents$.next({ mapName, event: MapItemEventType.Expired, data }),
        loaded: (data) => this.itemEvents$.next({ mapName, event: MapItemEventType.Loaded, data }),
        mapEvicted: (data) => this.entityEvents$.next({ mapName, event: MapEntityEventType.MapEvicted, data }),
        mapCleared: (data) => this.entityEvents$.next({ mapName, event: MapEntityEventType.MapCleared, data }),
      },
      undefined,
      true,
    )

    this.listeners.set(mapName, listenerId)
  }
}
