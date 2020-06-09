import { Controller, Get, Post, Body, Put, Delete, Param, NotFoundException } from '@nestjs/common'

import { MapListResDTO } from './dtos/mapList.dto'
import { MapDetailedResDTO } from './dtos/mapDetailed.dto'
import { MapPutKeyReqDTO } from './dtos/mapPutKey.dto'
import { MapReplaceKeyReqDTO } from './dtos/mapReplaceKey.dto'
import { MapsService } from './maps.service'
import { MapsGateway } from './maps.gateway'

// https://docs.nestjs.com/controllers

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService, private readonly mapsGateway: MapsGateway) {}

  @Get()
  async findAll(): Promise<MapListResDTO[]> {
    const maps = await this.mapsService.findAll()
    const formattedMaps = maps.map((item) => ({ name: item.getName() }))
    return formattedMaps
  }

  // TODO What are we going to return here?
  @Get(':id')
  async findOne(): Promise<MapDetailedResDTO> {
    // TODO
    return {}
  }

  // TODO we could support POST /maps/:id endpoint that would create a map

  @Get(':id/:key')
  async getKey(@Param('id') mapName: string, @Param('key') key: string): Promise<string | object> {
    const value = await this.mapsService.get<string, string | object>(mapName, key)

    if (!value) {
      throw new NotFoundException()
    }

    return value
  }

  @Post(':id/:key')
  async putKey(@Param('id') mapName: string, @Param('key') key: string, @Body() data: MapPutKeyReqDTO): Promise<void> {
    await this.mapsService.create(mapName, key, data)
  }

  @Put(':id/:key')
  async replaceKey(@Param('id') mapName: string, @Param('key') key: string, @Body() data: MapReplaceKeyReqDTO): Promise<void> {
    await this.mapsService.update(mapName, key, data)
  }

  @Delete(':id/:key')
  async removeKey(@Param('id') mapName: string, @Param('key') key: string): Promise<void> {
    await this.mapsService.delete(mapName, key)
  }
}
