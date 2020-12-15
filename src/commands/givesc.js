import _ from 'lodash'
import Command from "../models/Command.js"
import Category from '../data/category.js'
import CurrencyManager from "../lib/currencyManager.js"

export default class GiveScredits extends Command {
  constructor() {
    super({
      commandName: 'givesc',
      usage: 'givesc @Person #credits',
      helpMessage: 'gives a number of your credits to someone else',
      category: Category.CURRENCY,
      argumentNames: ['recipient', 'amount']
    })
  }

  checkForArgumentError(msg, args) {
    const mentionId = msg?.mentions?.users?.firstKey() 
    if (!_.isFinite(_.toNumber(args?.amount))) {
      return "Please specify an amount of currency to transfer"
    } else if (!mentionId) {
      return "Please mention a user to transfer to"
    } else if (mentionId === msg?.author?.id) {
      return "You cannot transfer funds to yourself"
    }
  }

  async execute(msg, args) {
    const errMsg = this.checkForArgumentError(msg, args)
    if (errMsg) {
      return msg?.channel?.send(errMsg)
    }

    const recipient = msg?.mentions?.users?.first()
    const amount = Math.abs(_.toInteger(_.toFinite(args.amount)))

    const currencyManager = new CurrencyManager()
    const currencyError = await currencyManager.moveFunds(msg?.author?.id, recipient?.id, amount, "give")
    if (currencyError) {
      return msg?.channel?.send(currencyError)
    }
    msg?.channel?.send(`**${msg?.author}** transferred **${amount}** esc credits 💰 to **${recipient}**`)
  }
}