import checkPreds from "../lib/checkPreds.js"
import { HAS_MUSIC_MANAGER } from '../lib/discordPreds.js'
import { getMusicManager } from "../jobs/musicManager.js"
import Category from '../data/category.js'
import { MessageEmbed } from "discord.js"
import MusicCommand from "../models/MusicCommand.js"

export default class CurrentlyPlaying extends MusicCommand {
  constructor() {
    super({
      commandName: '?',
      helpMessage: 'get the currently playing song',
      category: Category.MUSIC
    })
  }

  async execute(msg) {
    const errMsg = checkPreds(HAS_MUSIC_MANAGER(msg))
    if (errMsg) return msg.reply(errMsg)

    const musicManager = getMusicManager(msg)
    const songs = (musicManager?.songQueue || []).slice(0, 2)

    if (songs?.length > 0) {
      const nowPlaying = songs?.[0]
      console.log(nowPlaying.link)
      const nowText = `**[${nowPlaying.name}](${nowPlaying.url})**
      *by ${nowPlaying.artist}*
      ${nowPlaying.url}`
      const onDeck = songs?.[1]
      const onDeckText = !onDeck ? '' : `\n\n*On Deck: **${onDeck.name}** by ${onDeck.artist}*` 
      
      msg?.channel?.send(new MessageEmbed()
        .setTitle('🎶 Currently Playing 🎶')
        .setColor(0xff4500)
        .setDescription(`${nowText}${onDeckText}`)
      )
    }
  }
}