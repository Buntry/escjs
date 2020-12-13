import Command from "../models/Command.js"
import Category from '../data/category.js'
import CurrencyManager from "../lib/currencyManager.js"

export default class Screds extends Command {
  constructor() {
    super({
      commandName: 'screds',
      helpMessage: 'checks the amount of Esc Credits you have',
      category: Category.CURRENCY
    })
  }

  async execute(msg) {
    const currencyManager = new CurrencyManager()
    const acc = await currencyManager.getAccount(msg?.author?.id)

    msg?.channel?.send(`**${msg?.author}** has **${acc?.creditBalance}** scredits 💰`)
  }
}