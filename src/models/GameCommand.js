import Clearance from '../data/clearance.js'
import Category from '../data/category.js'
import DeprecatedCommand from './DeprecatedCommand.js'

class GameCommand extends DeprecatedCommand {
  constructor({ 
    commandName, 
    helpMessage, 
    clearance = Clearance.EVERYWHERE, 
    usage = commandName,
    argumentNames = [],
    category = Category.GAMES,
    hidden = false
  }) {
    super(commandName, helpMessage, clearance, usage, argumentNames, category, hidden)
    this.commandName = commandName
  }
}

export default GameCommand