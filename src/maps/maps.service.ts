import { Injectable, OnModuleDestroy, NotFoundException } from '@nestjs/common'
import { EntryEvent } from 'hazelcast-client/lib/core/EntryListener'
import { MapEvent } from 'hazelcast-client/lib/core/MapListener'
import { Subject } from 'rxjs'

import { HazelcastClientService } from '../core/hazlecastClient.service'
import { MapItemEvent, MapEntityEvent } from './consts'
import { MapNotFoundError } from '../core/errors/mapNotFound.error'

@Injectable()
export class MapsService implements OnModuleDestroy {
  public readonly itemEvents$ = new Subject<{ mapName: string; event: MapItemEvent; data: EntryEvent<unknown, unknown> }>()
  public readonly entityEvents$ = new Subject<{ mapName: string; event: MapEntityEvent; data: MapEvent }>()

  private listeners = new Map<string, string>()

  constructor(private readonly hazelcastClientService: HazelcastClientService) {}

  async onModuleDestroy() {
    // TODO: Investigate how many listeners we can remove at once safely
    for (const listenerId of this.listeners.values()) {
      await this.hazelcastClientService.client.removeDistributedObjectListener(listenerId)
    }
  }

  async findAllMaps() {
    const distributedObjects = await this.hazelcastClientService.client.getDistributedObjects()
    const maps = distributedObjects.filter((item) => item.getServiceName() === 'map')
    return maps
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
  }

  async deleteMap(mapName: string) {
    const map = await this.findMap(mapName)

    await map.destroy()

    this.listeners.delete(mapName)
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

    const listenerId = await map.addEntryListener({
      removed: (data) => this.itemEvents$.next({ mapName, event: MapItemEvent.Removed, data }),
      added: (data) => this.itemEvents$.next({ mapName, event: MapItemEvent.Added, data }),
      updated: (data) => this.itemEvents$.next({ mapName, event: MapItemEvent.Updated, data }),
      merged: (data) => this.itemEvents$.next({ mapName, event: MapItemEvent.Merged, data }),
      evicted: (data) => this.itemEvents$.next({ mapName, event: MapItemEvent.Evicted, data }),
      expired: (data) => this.itemEvents$.next({ mapName, event: MapItemEvent.Expired, data }),
      loaded: (data) => this.itemEvents$.next({ mapName, event: MapItemEvent.Loaded, data }),
      mapEvicted: (data) => this.entityEvents$.next({ mapName, event: MapEntityEvent.MapEvicted, data }),
      mapCleared: (data) => this.entityEvents$.next({ mapName, event: MapEntityEvent.MapCleared, data }),
    })

    this.listeners.set(mapName, listenerId)
  }
}
