import { Controller, Get, Post, Body, Put, Delete, Param } from '@nestjs/common'

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

  @Get(':id')
  async findOne(): Promise<MapDetailedResDTO> {
    // TODO
    return {}
  }

  @Get(':id/:key')
  async getKey(): Promise<{
    /** TODO: What are the possible map values? */
  }> {
    // TODO
    return {}
  }

  @Post(':id/:key')
  async putKey(@Param('id') mapName: string, @Param('key') key: string, @Body() data: MapPutKeyReqDTO): Promise<void> {
    await this.mapsService.putKey(mapName, key, data)
  }

  @Put(':id/:key')
  async replaceKey(@Body() data: MapReplaceKeyReqDTO): Promise<void> {
    // TODO
    return {}
  }

  @Delete(':id/:key')
  async removeKey(): Promise<void> {
    // TODO
  }
}
