import Command from "../models/Command.js";

export default class Ping extends Command {
  constructor() {
    super({
      commandName: 'ping',
      helpMessage: 'get a welcome message from the bot'
    })
  }

  async execute(msg) {
    msg.reply("Pong!")
  }
}