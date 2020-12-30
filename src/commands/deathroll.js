import _ from 'lodash'
import Command from "../models/Command.js"
import Category from '../data/category.js'
import checkPreds from "../lib/checkPreds.js"
import randomElement from "../lib/randomElement.js"
import { MessageEmbed } from 'discord.js'
import CurrencyManager from '../lib/currencyManager.js'

export default class Deathroll extends Command {
  constructor() {
    super({
      commandName: 'deathroll',
      usage: 'deathroll #amount',
      helpMessage: 'challenges someone to a deathroll',
      category: Category.GAMES,
      argumentNames: ['amount']
    })

    this.currencyManager = new CurrencyManager()
  }

  getPredicates(args) {
    return { "Please specify an amount to bet": _.isFinite(_.toNumber(args?.amount)) }
  }

  async execute(msg, args) {
    const errMsg = checkPreds(this.getPredicates(args))
    if (errMsg) {
      return msg?.channel?.send(errMsg)
    }

    const amt = Math.floor(_.toNumber(args?.amount))
    const challengeMsg = await msg?.channel?.send(`${msg?.author} is challenging anyone to a **deathroll**
Click the ✅ button to accept the challenge.`)
    const filter = (reaction, user) => !user?.bot &&
        reaction?.emoji?.name === '✅' // && user?.id !== msg?.author?.id
    challengeMsg?.react('✅')
    const collector = challengeMsg?.createReactionCollector(filter, { time: 30000 })
      .on('collect', (reaction, challenger) => {
        this.beginChallenge(msg?.channel, msg?.author, challenger, amt)
        collector?.stop()
      }).on('end', () => challengeMsg?.reactions?.removeAll())
  }

  roll(die) { return Math.floor(Math.random() * Math.floor(die)) + 1 }
  deathgif() {
    return randomElement([
      'https://i.pinimg.com/originals/31/7f/31/317f31681987eaadca9cb30ebed46902.gif',
      'https://i.kym-cdn.com/photos/images/newsfeed/000/891/448/bd6.gif',
      'https://31.media.tumblr.com/tumblr_mawpjqUgLk1r97egxo1_500.gif'
    ])
  }

  async beginChallenge(channel, author, challenger, amount) {
    const currentRoller = this.roll(2) == 1 ? author : challenger
    const otherRoller = currentRoller === author ? challenger : author

    channel?.send('A worthy challenger approaches...')
    channel?.send(new MessageEmbed()
      .setTitle('☠️ DEATHROLL 🔥')
      .setColor(0xff4500)
      .setDescription(`Compete to **death** 💀 over **${amount}** esc credits 💰
        
${author} **VERSUS** ${challenger}`))

    const winner = await this.beginRound(channel, currentRoller, otherRoller, amount * 10)
    if (winner) {
      channel?.send(new MessageEmbed()
        .setColor(0xff4500)
        .setDescription(`${winner} has won **${amount}** esc credits 💰`))
      const loser = winner === currentRoller ? otherRoller : currentRoller
      this.currencyManager.moveFunds(loser?.id, winner?.id, amount, "deathroll")
    }
  }

  async beginRound(channel, roller, otherRoller, dieSize) {
    if (dieSize <= 1) {
      channel?.send(`${otherRoller} *...death awaits*`)
      channel?.send(this.deathgif())
      return roller
    }

    channel?.send(`${roller} is rolling with **${dieSize}**
Please type \`roll\` or \`r\` to continue rolling`)
    
    const isRollerAndRoll = msg => msg?.author?.id === roller?.id && ['r', 'roll'].includes(msg?.content) 
    return await channel?.awaitMessages(isRollerAndRoll, { time: 30000, max: 1 })
      .then(async collected => {
        const rolled = collected?.first()
        if (rolled) {
          const newDieSize = this.roll(dieSize)
          channel?.send(`${roller} rolled a **${newDieSize}!**`)
          return await this.beginRound(channel, otherRoller, roller, newDieSize)
        } else {
          channel?.send(`${roller} never rolled...`)
          return otherRoller
        }
      }) 
  }
}