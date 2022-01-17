import Category from '../data/category.js'
import checkPreds from "../lib/checkPreds.js"
import { HAS_MUSIC_MANAGER } from '../lib/discordPreds.js'
import { getMusicManager } from "../jobs/musicManager.js"
import MusicCommand from "../models/MusicCommand.js"

export default class Repeat extends MusicCommand {
  constructor() {
    super({
      commandName: 'repeat',
      helpMessage: 'toggles repeating the entire queue of music',
      category: Category.MUSIC
    })
  }

  async execute(msg) {
    const errMsg = checkPreds(HAS_MUSIC_MANAGER(msg))
    if (errMsg) return msg.reply(errMsg)

    const isRepeating = await getMusicManager(msg)?.repeat(msg)
    msg?.channel?.send(isRepeating ? 'Queue set to repeat 🔁' : 'Queue not repeating')
  }
}