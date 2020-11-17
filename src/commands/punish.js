import Command from "../models/Command.js"
import prisons from '../data/prisons.js'
import randomElement from "../lib/randomElement.js"

export default class Punish extends Command {
  constructor() {
    super({
      commandName: 'punish',
      helpMessage: 'sends a user to the pog prison'
    })
  }

  async execute(msg) {
    const guild = msg?.guild  
    const prisonChannelId = prisons[guild?.id]
    if (prisonChannelId) {
      const victim = msg?.mentions?.users?.first() || msg?.author
      guild?.members?.fetch(victim?.id)
        .then(victim => victim?.voice?.setChannel(prisonChannelId))
      
      const options = [
        'You\'re going to the shadow realm.',
        'You are hereby sentenced to a POGGING!',
        'git pogged on',
        'Now this is pog-racing',
      ]  

      msg?.channel?.send(`${victim.toString()}, ${randomElement(options)}`)
    } else {
      msg?.reply('No prison defined for this server yet.')
    }
  }
}