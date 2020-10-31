export default class Command {
  constructor({ commandName }) {
    this.commandName = commandName
  }

  async execute (msg) {
    throw new Error(`Basic command is not implemented: ${msg?.content}`)
  }
}