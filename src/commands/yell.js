import RandomSoundCommand from '../lib/randomSoundCommand.js'

export default class Yell extends RandomSoundCommand {
  constructor() {
    super({
      commandName: 'yell',
      helpMessage: 'yells in chat',
      soundPath: './resources/sounds/yell/',
      fileName: 'yell.zip'
    })
  }
}