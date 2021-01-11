import Command from "../models/Command.js"
import Category from '../data/category.js'
import CurrencyManager from "../lib/currencyManager.js"
import prkr from "../prkr.ml/client.js"
import randomElement from "../lib/randomElement.js"

export default class Redeem extends Command {
  constructor() {
    super({
      commandName: 'redeem',
      helpMessage: 'redeems all rewards you have',
      category: Category.CURRENCY
    })
    this.currencyManager = new CurrencyManager()
  }

  getPhrase() {
    return randomElement([
      "just cashed in",
      "just milked us for",
      "is rolling in",
      "got away with",
      "hustled us for"
    ])
  }

  async execute(msg) {
    const rewards = await prkr.getRewards(msg?.author)
    if (rewards?.foundRewards) {
      let total = 0
      rewards?.redeemed?.forEach(redeemed => {
        this.currencyManager.moveFunds(redeemed?.fromDiscordUid, redeemed?.discordUid, redeemed?.amount, null, redeemed?.type)
        total += redeemed?.amount
      })
      msg?.channel?.send(`${msg?.author} ${this.getPhrase()} **${total}** esc credits.`)
    } else {
      msg?.channel?.send("We couldn't find any rewards for you to redeem.")
    }
  }
}