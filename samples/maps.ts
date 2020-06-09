import * as io from 'socket.io-client'
import { MapItemEventResDTO } from 'src/maps/dtos/mapItemEvent.dto'
import { MapEntityEventResDTO } from 'src/maps/dtos/mapEntityEvent.dto'
import axios from 'axios'

const sleep = async (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout))

const baseUrl = 'http://localhost:3000'
const newMapName = 'map-3'

const httpClient = axios.create({
  baseURL: baseUrl,
})

const main = async () => {
  console.log('main')

  const socket = io(baseUrl)
  socket.on('connect', () => console.log('Listening to the server events'))
  socket.on('mapItem', (data: MapItemEventResDTO) => console.log('Received map item event', data))
  socket.on('map', (data: MapEntityEventResDTO) => console.log('Received map entity event', data))

  await sleep(2000)

  console.log('main -> creating a new map', newMapName)
  await httpClient.post('maps', { name: newMapName })

  await sleep(2000)

  console.log('main -> inserting a key')
  await httpClient.post(`maps/${newMapName}/luke`, { data: { jedi: 'test' } })

  await sleep(2000)

  console.log('main -> receiving the key')
  const { data } = await httpClient.get(`maps/${newMapName}/luke`)
  console.log('main -> received the key', data)

  await sleep(2000)

  console.log('main -> removing the key')
  await httpClient.delete(`maps/${newMapName}/luke`)

  await sleep(2000)

  console.log('main -> removing the map', newMapName)
  await httpClient.delete(`maps/${newMapName}`)
  console.log('main -> removed the map', newMapName)

  console.log('main -> end')
}

const timerId = setTimeout(() => {}, 1000000)
main()
  .catch(console.error)
  .then(() => clearTimeout(timerId))
