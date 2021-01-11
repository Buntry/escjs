import _ from 'lodash'
import Command from "../models/Command.js"
import MusicQuizManager from '../jobs/musicQuizManager.js'
import checkPreds from '../lib/checkPreds.js'
import { HAS_MUSIC_MANAGER } from '../lib/discordPreds.js'
import { getMusicManager, mapMusicManager } from "../jobs/musicManager.js"
import Category from '../data/category.js'

export default class StartMusicQuiz extends Command {
  constructor() {
    super({
      commandName: 'start-quiz',
      usage: 'start-quiz #rounds',
      helpMessage: 'starts a quiz using the current music queue',
      category: Category.GAMES,
      argumentNames: ['numRounds']
    })
  }

  async execute(msg, args) {
    const errMsg = checkPreds(HAS_MUSIC_MANAGER(msg))
    if (errMsg) return msg?.reply(errMsg)

    const numRounds =  (args?.numRounds && _.toNumber(args?.numRounds))
      ? _.toNumber(args?.numRounds) : 5

    mapMusicManager(msg, musicManager => new MusicQuizManager(musicManager, numRounds))
    getMusicManager(msg)?.startQuiz(msg)
  }
}