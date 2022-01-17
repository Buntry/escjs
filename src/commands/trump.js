import Command from "../models/Command.js"
import getTrumpQuote from '../config/trump.js'

export default class Trump extends Command {
  constructor() {
    super({
      commandName: 'trump',
      helpMessage: 'get back a random trump quote',
      hidden: true
    })
  }

  async execute(msg) {  
    const quote = await getTrumpQuote()
    if (quote)
      msg?.channel?.send(`${quote}\n*- Trump*`)
  }
}