import checkPreds from "../lib/checkPreds.js"
import { IN_GUILD_VC } from '../lib/discordPreds.js'
import { getMusicManager } from "../jobs/musicManager.js"
import Category from '../data/category.js'
import MusicCommand from "../models/MusicCommand.js"

export default class Play extends MusicCommand {
  constructor() {
    super({
      commandName: 'play',
      helpMessage: 'play a youtube video or spotify video',
      usage: 'play (youtube + spotify link | search terms)',
      argumentNames: ['query'],
      category: Category.MUSIC
    })
  }

  async execute(msg, args) {
    const errMsg = checkPreds({ ...IN_GUILD_VC(msg),
      'You must provide a resource to play': args?.query
    })
    if (errMsg) return msg.reply(errMsg)

    getMusicManager(msg)?.addSong(args?.query)
  }
}