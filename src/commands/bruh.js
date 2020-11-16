import RandomSoundCommand from '../lib/randomSoundCommand.js'

export default class Bruh extends RandomSoundCommand {
  constructor() {
    super({
      commandName: 'bruh',
      helpMessage: 'plays a random bruh noise',
      soundPath: './resources/sounds/bruh/',
      fileName: 'bruh.zip'
    })
  }
}