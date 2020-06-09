import { WebSocketGateway, OnGatewayInit, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

import { MapsService } from './maps.service'
import { MapItemEventResDTO } from './dtos/mapItemEvent.dto'
import { MapEntityEventResDTO } from './dtos/mapEntityEvent.dto'
import { OnModuleInit, OnApplicationBootstrap } from '@nestjs/common'

// https://docs.nestjs.com/websockets/gateways#example

@WebSocketGateway()
export class MapsGateway implements OnApplicationBootstrap {
  @WebSocketServer()
  server!: Server

  constructor(private readonly mapsService: MapsService) {}

  async onApplicationBootstrap() {
    console.log('MapsGateway.onApplicationBootstrap')

    this.mapsService.itemEvents$.subscribe(({ mapName, event, data }) => {
      const eventData: MapItemEventResDTO = {
        ...data,
        mapName,
      }
      this.server.emit(event, eventData)
    })
    this.mapsService.entityEvents$.subscribe(({ mapName, event, data }) => {
      const eventData: MapEntityEventResDTO = {
        ...data,
        mapName,
      }
      this.server.emit(event, eventData)
    })

    const maps = await this.mapsService.findAllMaps()

    for (const map of maps) {
      const mapName = map.getName()
      await this.mapsService.subscribeToMap(mapName)
    }

    console.log('MapsGateway.onApplicationBootstrap -> finished')
  }
}
