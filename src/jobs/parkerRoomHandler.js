import VoiceStateUpdateHandler from "../models/handlers/VoiceStateUpdateHandler.js";
import sleep from '../lib/sleep.js'
import dayjs from 'dayjs'

const ROOMS = {
  '361291881059057664': { '781560445890330624': true },
  '734586607285567528': { '781582534352961546': true }
}

const memberJoinedOneOfParkerRooms = ([oldState, newState]) => {
  const guildId = newState?.guild?.id

  return guildId in ROOMS
  && newState?.channelID in ROOMS[guildId] 
  && !(oldState?.channelID in ROOMS[guildId]) 
  && newState?.member?.user?.bot === false
}

export default class ParkerRoomHandler extends VoiceStateUpdateHandler {
  constructor() {
    super({ shouldRun: memberJoinedOneOfParkerRooms })
    this.sleepDelay = 5000
    this.lastDone = null
    this.minuteThreshold = 10
  }

  handle(states) {
    const newState = states?.[1]
    const now = dayjs()
    if (this.lastDone !== null && now.diff(this.lastDone, 'minute') < this.minuteThreshold)
      return
    this.lastDone = now

    sleep(this.sleepDelay).then(() => {
      newState?.channel?.fetch().then(channel => {
        if (channel?.members?.findKey(gm => gm?.user?.bot === false)) {
          channel?.join()?.then(connection => {
            connection?.play('./resources/sounds/parkerroom/getout.m4a')
              .on('finish', () => sleep(500).then(() => connection?.disconnect()))
          })
        }
      })
    })
  }
}