export default class Command {
  constructor({ commandName, helpMessage }) {
    this.commandName = commandName
    this.helpMessage = helpMessage
  }

  async execute (msg) {
    throw new Error(`Basic command is not implemented: ${msg?.content}`)
  }
}