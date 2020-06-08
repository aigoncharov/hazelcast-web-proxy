import { EntryEvent } from 'hazelcast-client'

export type MapItemEventResDTO = EntryEvent<unknown, unknown> & { mapName: string }
