import Category from '../data/category.js'
import CurrencyManager from "../lib/currencyManager.js"
import GameCommand from "../models/GameCommand.js"

export default class Screds extends GameCommand {
  constructor() {
    super({
      commandName: 'screds',
      helpMessage: 'checks the amount of esc credits you have',
      category: Category.CURRENCY
    })
  }

  async execute(msg) {
    const currencyManager = new CurrencyManager()
    const acc = await currencyManager.getAccount(msg?.author?.id)

    msg?.channel?.send(`**${msg?.author}** has **${acc?.creditBalance}** scredits 💰`)
  }
}