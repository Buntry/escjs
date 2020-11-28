import Command from "../models/Command.js"
import Category from '../data/category.js'
import checkPreds from "../lib/checkPreds.js"
import { HAS_MUSIC_MANAGER } from '../lib/discordPreds.js'
import { getMusicManager } from "../jobs/musicManager.js"

export default class Clear extends Command {
  constructor() {
    super({
      commandName: 'clear',
      helpMessage: 'clears the music queue',
      category: Category.MUSIC
    })
  }

  async execute(msg) {
    const errMsg = checkPreds(HAS_MUSIC_MANAGER(msg))
    if (errMsg) return msg.reply(errMsg)

    getMusicManager(msg)?.clear(msg)
    msg?.channel?.send('Queue Cleared')
  }
}