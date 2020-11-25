import Command from "../models/Command.js";
import { MessageEmbed } from 'discord.js'
import _ from 'lodash'
import cmds from './cmds.js'
import prefix from '../config/prefix.js'

export default class Help extends Command {
  constructor() {
    super({
      commandName: 'help',
      helpMessage: 'get a list of the possible commands'
    })
  }

  async execute(msg) {   
    const helpEmbeds = _.chain(Array.from(cmds.values()))
      .groupBy('category')
      .map((categoryCmds, categoryName) => new MessageEmbed()
        .setTitle(`__${categoryName}__`)
        .setColor(0xff4500)
        .setDescription(_.map(categoryCmds, cmd => 
          `\t**${prefix}${cmd.usage}**:\t${cmd.helpMessage}`).join('\n')))
      .value()

    msg?.author?.createDM().then(async channel => {
      _.reduce(helpEmbeds, (promise, helpEmbed) => 
        promise.then(() => channel?.send(helpEmbed)), Promise.resolve())
        .then(() => msg?.author?.deleteDM())
    })  
  }
}