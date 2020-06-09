import { WebSocketGateway, OnGatewayInit } from '@nestjs/websockets'
import { Server } from 'socket.io'

import { MapsService } from './maps.service'
import { MapItemEventResDTO } from './dtos/mapItemEvent.dto'
import { MapEntityEventResDTO } from './dtos/mapEntityEvent.dto'

// https://docs.nestjs.com/websockets/gateways#example

@WebSocketGateway()
export class MapsGateway implements OnGatewayInit {
  constructor(private readonly mapsService: MapsService) {}

  async afterInit(server: Server) {
    this.mapsService.itemEvents$.subscribe(({ mapName, event, data }) => {
      const eventData: MapItemEventResDTO = {
        ...data,
        mapName,
      }
      server.emit(event, eventData)
    })
    this.mapsService.entityEvents$.subscribe(({ mapName, event, data }) => {
      const eventData: MapEntityEventResDTO = {
        ...data,
        mapName,
      }
      server.emit(event, eventData)
    })

    const maps = await this.mapsService.findAll()

    for (const map of maps) {
      const mapName = map.getName()
      await this.mapsService.subscribeToMap(mapName)
    }
  }
}
