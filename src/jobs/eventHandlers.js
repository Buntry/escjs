import { readdirSync } from 'fs'
import DiscordEventHandler from '../models/handlers/DiscordEventHandler.js'

const eventHandlers = new Map()
export default eventHandlers

const addEventHandler = (eventName, eventHandler) => {
  eventHandlers.has(eventName)
    ? eventHandlers.get(eventName).push(eventHandler)
    : eventHandlers.set(eventName, [ eventHandler ])
}

readdirSync('./src/jobs')
  .filter(file => file && file !== 'eventHandlers.js')
  .map(async handlerFile => {
    const eventHandlerModule = await import(`./${handlerFile}`)
    const eventHandler = new eventHandlerModule.default()
    if (eventHandler instanceof DiscordEventHandler) {
      addEventHandler(eventHandler.discordEvent, eventHandler)
    }
  })