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
    const helpTexts = _.chain(Array.from(cmds.values()))
      .groupBy('category')
      .map((categoryCmds, categoryName) => `
        __${categoryName}__
        ${_.map(categoryCmds, cmd => 
    `\t**${prefix}${cmd.usage}**:\t${cmd.helpMessage}`).join('\n')}`)
      .value()

    msg?.author?.createDM().then(async channel => {
      const embed = new MessageEmbed()
        .setTitle('COMMANDS:')
        .setColor(0xff4500)
        .setDescription(helpTexts.join('\n'))
      await channel?.send(embed)
      msg?.author?.deleteDM()
    })  
  }
}