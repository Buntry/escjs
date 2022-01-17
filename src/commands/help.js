import Command from "../models/Command.js"
import { MessageEmbed } from 'discord.js'
import _ from 'lodash'
import cmds from './cmds.js'
import prefix from '../config/prefix.js'
import DeprecatedCommand from "../models/DeprecatedCommand.js"

export default class Help extends Command {
  constructor() {
    super({
      commandName: 'help',
      helpMessage: 'get a list of the possible commands',
      argumentNames: ['here']
    })
  }

  async execute(msg, args) {   
    const helpEmbeds = _.chain(Array.from(cmds.values()))
      .filter(command => !(command instanceof DeprecatedCommand))
      .groupBy('category')
      .map((categoryCmds, categoryName) => new MessageEmbed()
        .setTitle(`__${categoryName}__`)
        .setColor(0xff4500)
        .setDescription(_.chain(categoryCmds)
          .filter(cmd => !cmd.hidden)
          .map(cmd => `\t**${prefix}${cmd.usage}**:\t${cmd.helpMessage}`)
          .value()
          .join('\n')))
      .value()

    const sendEmbeds = (channel) => _.reduce(helpEmbeds, (promise, helpEmbed) => 
      promise.then(() => channel?.send(helpEmbed)), Promise.resolve())
      

    if (args?.here == 'here') {
      sendEmbeds(msg?.channel)
    } else {  
      msg?.author?.createDM().then(sendEmbeds)
        .then(() => msg?.author?.deleteDM()) 
    }  
  }
}