import _ from 'lodash'
import Command from "../models/Command.js"
import Category from '../data/category.js'
import checkPreds from "../lib/checkPreds.js"
import { MessageEmbed } from 'discord.js'

export default class Deathroll extends Command {
  constructor() {
    super({
      commandName: 'deathroll',
      usage: 'deathroll #amount',
      helpMessage: 'challenges someone to a deathroll',
      category: Category.GAMES,
      argumentNames: ['amount']
    })
  }

  getPredicates(args) {
    return { "Please specify an amount to bet": _.isFinite(_.toNumber(args?.amount)) }
  }

  async execute(msg, args) {
    const errMsg = checkPreds(this.getPredicates(args))
    if (errMsg) {
      return msg?.channel?.send(errMsg)
    }

    const challengeMsg = await msg?.channel?.send(`${msg?.author} is challenging anyone to a **deathroll**
Click the ✅ button to accept the challenge.`)
    const filter = (reaction, user) => !user?.bot &&
        reaction?.emoji?.name === '✅' // && user?.id !== msg?.author?.id
    challengeMsg?.react('✅')
    const collector = challengeMsg?.createReactionCollector(filter, { time: 30000 })
      .on('collect', (reaction, challenger) => {
        this.beginChallenge(msg?.channel, msg?.author, challenger, args?.amount)
        collector?.stop()
      }).on('end', () => challengeMsg?.reactions?.removeAll())
  }


  async beginChallenge(channel, author, challenger, amount) {
    channel?.send('A worthy challenger approaches...')
    channel?.send(new MessageEmbed()
      .setTitle('☠️ DEATHROLL 🔥')
      .setColor(0xff4500)
      .setDescription(`Compete to **death** 💀 over **${amount}** esc credits 💰
        
${author} **VERSUS** ${challenger}`))
  }
}