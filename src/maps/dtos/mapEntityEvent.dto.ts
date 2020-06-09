import { MapEvent } from 'hazelcast-client'

import { MapEntityEventType } from '../consts'

export type MapEntityEventResDTO = MapEvent & { mapName: string; type: MapEntityEventType }
