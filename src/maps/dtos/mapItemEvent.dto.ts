import { EntryEvent } from 'hazelcast-client'

import { MapItemEventType } from '../consts'

export type MapItemEventResDTO = EntryEvent<unknown, unknown> & { mapName: string; type: MapItemEventType }
