import Clearance from '../data/clearance.js'
import Category from '../data/category.js'
import Command from "./Command.js"

class DeprecatedCommand extends Command {
  constructor({ 
    commandName, 
    helpMessage, 
    clearance = Clearance.EVERYWHERE, 
    usage = commandName,
    argumentNames = [],
    category = Category.GENERAL,
    hidden = true
  }) {
    super({commandName, helpMessage, clearance, usage, argumentNames, category, hidden})
    this.commandName = commandName
  }

  async execute (msg) {
    msg?.reply(`That message is now deprecated. Sorry about that!`)
  }
}

export default DeprecatedCommand