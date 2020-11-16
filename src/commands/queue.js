import Command from "../models/Command.js"
import Category from '../data/category.js'
import checkPreds from "../lib/checkPreds.js"
import { HAS_MUSIC_MANAGER } from '../lib/discordPreds.js'
import { getMusicManager } from "../jobs/musicManager.js"
import _ from 'lodash'
import { MessageEmbed } from "discord.js"
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
import formatDuration from '../lib/formatDuration.js'
import posModulo from '../lib/posModulo.js'
import addReactionControls from '../lib/addReactionControls.js'
import sleep from '../lib/sleep.js'

dayjs.extend(duration)

export default class Queue extends Command {
  constructor() {
    super({
      commandName: 'queue',
      helpMessage: 'displays the current music queue',
      category: Category.MUSIC
    })
    this.pageSize = 10
  }

  async execute(msg) {
    const errMsg = checkPreds(HAS_MUSIC_MANAGER(msg))
    if (errMsg) return msg.reply(errMsg)

    const musicManager = getMusicManager(msg)
    let queuePages = this.getQueuePages(musicManager)
    let currentPageIdx = 0
    const embed = await msg?.channel?.send(queuePages?.[currentPageIdx])


    const showPage = (pageNumber) => {
      currentPageIdx = posModulo(pageNumber, queuePages?.length)
      embed?.edit(queuePages?.[currentPageIdx])
    }

    const refreshPages = () => {
      queuePages = this.getQueuePages(musicManager)
      showPage(0)
    }

    addReactionControls(embed, { time: 120000 }, {
      '⬅️': () => showPage(currentPageIdx - 1),
      '➡️': () => showPage(currentPageIdx + 1),
      '⏸': () => musicManager?.pause(),
      '▶️': () => musicManager?.resume(),
      '⏭️': () => musicManager?.skip()?.then(() => sleep(1000))?.then(refreshPages),
      '🔀': () => musicManager?.shuffle()?.then(() => sleep(1000))?.then(refreshPages),
      '🟥': ({ reactionCollector }) => { 
        reactionCollector?.stop()
        embed?.reactions?.removeAll()
        musicManager?.stop() 
      } 
    })
  }

  getQueuePages(musicManager) {
    const toListing = (pageIdx, song, idx) => {
      const songLength = _.toNumber(song?.info?.videoDetails?.lengthSeconds)
      const durationString = songLength 
        ? ` **(${formatDuration(dayjs.duration(songLength, 's'))})**` 
        : ''
      return `**${(pageIdx * this.pageSize) + idx + 1}.** ${song?.name} *by ${song?.artist}*${durationString}`
    }
  
    return _.chain(musicManager?.songQueue || [])
      .chunk(this.pageSize)
      .map((pageSongs, pageIdx, pages) => new MessageEmbed()
        .setTitle('🎶 Music Queue 🎶')
        .setColor(0xff4500)
        .setDescription(`${pageSongs.map((song, idx) => toListing(pageIdx, song, idx)).join('\n')}
          \n__Page ${pageIdx + 1}/${pages.length}__`)
      )
      .value()
  }
}