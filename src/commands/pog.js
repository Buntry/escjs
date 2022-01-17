import Command from "../models/Command.js"

export default class Pog extends Command {
  constructor() {
    super({
      commandName: 'pog',
      helpMessage: 'get a pog message from the bot'
    })
  }

  async execute(msg) {
    msg.reply("Pog!")
  }
}