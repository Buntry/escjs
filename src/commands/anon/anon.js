import Command from '../../models/Command.js';
import { displayHex, generateUIDHash } from '../../lib/anonmanager.js';

export default class Anon extends Command {
  constructor() {
    super({
      commandName: 'anon',
      helpMessage: 'sends an anonymous message into debate-discussion'
    })
  }

  async execute(msg) {
    msg.channel.send(`hey there, your hash is ${displayHex(generateUIDHash(msg.author.id))}`)
  }
}