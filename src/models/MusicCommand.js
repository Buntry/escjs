import Clearance from '../data/clearance.js'
import Category from '../data/category.js'
import DeprecatedCommand from './DeprecatedCommand.js'

class MusicCommand extends DeprecatedCommand {
  constructor({ 
    commandName, 
    helpMessage, 
    clearance = Clearance.EVERYWHERE, 
    usage = commandName,
    argumentNames = [],
    category = Category.MUSIC,
    hidden = false
  }) {
    super({commandName, helpMessage, clearance, usage, argumentNames, category, hidden})
    this.commandName = commandName
  }
}

export default MusicCommand