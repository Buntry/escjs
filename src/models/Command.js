import Clearance from '../data/clearance.js'
import Category from '../data/category.js'

export default class Command {
  constructor({ 
    commandName, 
    helpMessage, 
    clearance = Clearance.EVERYWHERE, 
    usage = commandName,
    argumentNames = [],
    category = Category.GENERAL
  }) {
    this.commandName = commandName
    this.helpMessage = helpMessage
    this.clearance = clearance
    this.usage = usage
    this.argumentNames = argumentNames
    this.category = category
  }

  async execute (msg) {
    throw new Error(`Basic command is not implemented: ${msg?.content}`)
  }
}