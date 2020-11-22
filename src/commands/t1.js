import RandomSoundCommand from '../lib/randomSoundCommand.js'

export default class Tyler1 extends RandomSoundCommand {
  constructor() {
    super({
      commandName: 't1',
      helpMessage: 'plays a random tyler1 screech',
      soundPath: './resources/sounds/tyler1/',
      fileName: 'tyler1.zip'
    })
  }
}