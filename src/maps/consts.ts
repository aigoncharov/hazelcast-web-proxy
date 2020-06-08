import { WebSocketServer } from '@nestjs/websockets'

export const mapResourceUrl = 'maps'

export enum MapItemEvent {
  Added = 'MapItemAdded',
  Removed = 'MapItemRemoved',
  Updated = 'MapItemUpdated',
  Merged = 'MapItemMerged',
  Evicted = 'MapItemEvicted',
  Expired = 'MapItemExpired',
  Loaded = 'MapItemLoaded',
}

export enum MapEntityEvent {
  MapEvicted = 'MapEvicted',
  MapCleared = 'MapCleared',
}
