import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import Command from '../models/Command.js'

dayjs.extend(relativeTime)

export default class Uptime extends Command {
  constructor() {
    super({
      commandName: 'uptime',
      helpMessage: 'check how long the bot has been running'
    })
    this.createdAt = dayjs()
  }

  async execute(msg) {
    msg?.channel?.send(`I started ${this.createdAt.fromNow()}`)
  }
}