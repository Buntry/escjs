import fs from 'fs'
import unzipper from 'unzipper'
import Command from "../models/Command.js"
import randomElement from "../lib/randomElement.js"
import Category from '../data/category.js'

export default class RandomSoundCommand extends Command {
  constructor({commandName, helpMessage, soundPath, fileName }) {
    super({ commandName, helpMessage, category: Category.SOUNDBITES })
    this.soundPath = soundPath
    this.zipPath = this.soundPath + fileName
    fs.createReadStream(this.zipPath)
      .pipe(unzipper.Extract({ path: this.soundPath }));
  }

  async execute(msg) {
    const conn = msg?.member?.voice?.channel?.join()
      ?.then(connection => {
        fs.readdir(this.soundPath, (err, files) => {
          const soundFiles = files.filter(fileName => fileName.endsWith('.mp3'))
          const chosenSound = randomElement(soundFiles)
          connection.play(this.soundPath + chosenSound)
            .on('finish', () => connection.disconnect())
        })
      })
    if (!conn) {
      msg.reply('You need to be in a voice channel to use this command')
    }
  }
}