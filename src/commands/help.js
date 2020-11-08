import Command from "../models/Command.js";
import { MessageEmbed } from 'discord.js'

export default class Help extends Command {
  constructor() {
    super({
      commandName: 'help',
      helpMessage: 'get a list of the possible commands'
    })
  }

  async execute(msg) {
    import('./cmds.js').then(cmds => {
      msg.author.createDM().then(async channel => {
        const helpTexts = cmds.default.map(cmd => {
          return `**${process.env.BOT_COMMAND_PREFIX}${cmd.commandName}**:\t${cmd.helpMessage}`
        }).join('\n')

        const embed = new MessageEmbed()
          .setTitle('COMMANDS:')
          .setColor(0xff4500)
          .setDescription(helpTexts)
        await channel.send(embed)
      }).finally(() => {
        msg.author.deleteDM()
      })
    })
  }
}