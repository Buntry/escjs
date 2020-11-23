import fs from 'fs'
import unzipper from 'unzipper'
import Command from "../models/Command.js"
import Category from '../data/category.js'
import checkPreds from './checkPreds.js'
import { NO_MUSIC_MANAGER } from './discordPreds.js'
import cmds from '../commands/cmds.js'
import _ from 'lodash'
import randomElement from './randomElement.js'

class SoundBiteCommand extends Command {
  constructor({commandName, helpMessage, fileName }) {
    super({ commandName, helpMessage, category: Category.SOUNDBITES })
    this.filePath = `./resources/sounds/bites/${fileName}`
  }

  async execute(msg) {
    const errMsg = checkPreds(NO_MUSIC_MANAGER(msg))
    if (errMsg) return msg.reply(errMsg)
  
    const conn = msg?.member?.voice?.channel?.join()
      ?.then(connection => 
        connection.play(this.filePath)
          .on('finish', () => connection.disconnect())
      )
    if (!conn) {
      msg.reply('You need to be in a voice channel to use this command')
    }
  }
}

export default () => {
  const bitesPath = './resources/sounds/bites/'
  const biteZipPath = bitesPath + 'bites.zip'
  const options = (cmdName) => [
    `plays a random ${cmdName} noise`,
    `plays a random ${cmdName} sound`,
    `${cmdName} anthem`,
    `we stan ${cmdName} sounds`,
    `deliver ${cmdName} to your ears`,
    `torture people with ${cmdName}`,
    `delight people with ${cmdName}`,
    `listen to ${cmdName} in your dreams`
  ]


  const stream = fs.createReadStream(biteZipPath)
    .pipe(unzipper.Extract({ path: bitesPath }))
  stream.on('finish', () => {
    fs.readdir(bitesPath, (err, files) => {
      const soundFiles = files.filter(fileName => fileName.endsWith('.mp3'))
      soundFiles.forEach(fileName => {
        const commandName = _.trimEnd(fileName, '.mp3')
        cmds.set(commandName, new SoundBiteCommand({
          commandName,
          helpMessage: randomElement(options(commandName)),
          fileName
        }))
      })
    })
  })
}