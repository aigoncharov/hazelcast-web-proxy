import { Controller, Get, Post, Body, Put, Delete, Param, NotFoundException } from '@nestjs/common'

import { MapListResDTO } from './dtos/mapList.dto'
import { MapDetailedResDTO } from './dtos/mapDetailed.dto'
import { MapPutKeyReqDTO } from './dtos/mapPutKey.dto'
import { MapReplaceKeyReqDTO } from './dtos/mapReplaceKey.dto'
import { MapsService } from './maps.service'
import { MapsGateway } from './maps.gateway'
import { MapCreateDTO } from './dtos/mapCreate.dto'

// https://docs.nestjs.com/controllers

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService, private readonly mapsGateway: MapsGateway) {}

  @Get()
  async findAllMaps(): Promise<MapListResDTO[]> {
    const maps = await this.mapsService.findAllMaps()
    const formattedMaps = maps.map((item): MapListResDTO => ({ name: item.getName() }))
    return formattedMaps
  }

  @Get(':id')
  async findMap(@Param('id') mapName: string): Promise<MapDetailedResDTO> {
    const map = await this.mapsService.findMap(mapName)

    const formattedMap: MapDetailedResDTO = {
      name: map.getName(),
    }
    return formattedMap
  }

  @Post()
  async createMap(@Body() { name }: MapCreateDTO): Promise<void> {
    await this.mapsService.createMap(name)
  }

  @Delete(':id')
  async removeMap(@Param('id') mapName: string): Promise<void> {
    await this.mapsService.deleteMap(mapName)
  }

  @Get(':id/:key')
  async getKey(@Param('id') mapName: string, @Param('key') key: string): Promise<string | object> {
    const value = await this.mapsService.get<string, string | object>(mapName, key)
    return value
  }

  @Post(':id/:key')
  async putKey(@Param('id') mapName: string, @Param('key') key: string, @Body() { data }: MapPutKeyReqDTO): Promise<void> {
    await this.mapsService.create(mapName, key, data)
  }

  @Put(':id/:key')
  async replaceKey(@Param('id') mapName: string, @Param('key') key: string, @Body() { data }: MapReplaceKeyReqDTO): Promise<void> {
    await this.mapsService.update(mapName, key, data)
  }

  @Delete(':id/:key')
  async removeKey(@Param('id') mapName: string, @Param('key') key: string): Promise<void> {
    await this.mapsService.delete(mapName, key)
  }
}
