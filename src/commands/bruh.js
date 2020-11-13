import fs from 'fs'
import unzipper from 'unzipper'
import Command from "../models/Command.js"
import randomElement from "../lib/randomElement.js"

export default class Bruh extends Command {
  constructor() {
    super({
      commandName: 'bruh',
      helpMessage: 'plays a random bruh noise'
    })
    this.bruhPath = './resources/sounds/bruh/'
    this.bruhZipPath = this.bruhPath + 'bruh.zip'
    fs.createReadStream(this.bruhZipPath)
      .pipe(unzipper.Extract({ path: this.bruhPath }));
  }

  async execute(msg) {
    const conn = msg?.member?.voice?.channel?.join()
      ?.then(connection => {
        fs.readdir(this.bruhPath, (err, files) => {
          const soundFiles = files.filter(fileName => fileName.endsWith('.mp3'))
          const chosenBruh = randomElement(soundFiles)
          connection.play(this.bruhPath + chosenBruh)
            .on('finish', () => {
              connection.disconnect()
            })
        })
      })
    if (!conn) {
      msg.reply('You need to be in a voice channel to use this command')
    }
  }
}