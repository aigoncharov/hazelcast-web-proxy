import { MapEvent } from 'hazelcast-client'

export type MapEntityEventResDTO = MapEvent & { mapName: string }
