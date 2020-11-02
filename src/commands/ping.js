import Command from "../models/Command.js";

export default class Pingpong extends Command {
  constructor() {
    super({ commandName: 'ping' })
  }

  async execute(msg) {
    msg.reply("hello, im a bot")
  }
}