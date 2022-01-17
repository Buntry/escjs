import checkPreds from "../lib/checkPreds.js"
import Category from '../data/category.js'
import { HAS_MUSIC_MANAGER } from '../lib/discordPreds.js'
import { getMusicManager } from "../jobs/musicManager.js"
import MusicCommand from "../models/MusicCommand.js"

export default class Resume extends MusicCommand {
  constructor() {
    super({
      commandName: 'resume',
      helpMessage: 'resumes what is currently playing',
      category: Category.MUSIC
    })
  }

  async execute(msg) {
    const errMsg = checkPreds(HAS_MUSIC_MANAGER(msg))
    if (errMsg) return msg.reply(errMsg)

    getMusicManager(msg)?.resume(msg)
    msg?.channel?.send('🎵 Music Resumed')
  }
}