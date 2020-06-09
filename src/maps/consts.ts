import { WebSocketServer } from '@nestjs/websockets'

export const mapResourceUrl = 'maps'

export const mapItemEvent = 'mapItem'

export enum MapItemEventType {
  Added = 'MapItemAdded',
  Removed = 'MapItemRemoved',
  Updated = 'MapItemUpdated',
  Merged = 'MapItemMerged',
  Evicted = 'MapItemEvicted',
  Expired = 'MapItemExpired',
  Loaded = 'MapItemLoaded',
}

export const mapEntityEvent = 'map'

export enum MapEntityEventType {
  MapEvicted = 'MapEvicted',
  MapCleared = 'MapCleared',
}

export const validationConstraints = {
  mapName: {
    minLength: 1,
    maxLength: 128,
  },
}
