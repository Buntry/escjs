import Command from "../models/Command.js";
import admins from "../data/admins.js";
import users from "../data/users.js";
import servers from "../data/servers.js";

const REASONING = 'Resetting nicknames server-wide'

export default class Reset extends Command {
  constructor() {
    super({
      commandName: 'reset',
      helpMessage: 'resets the nicknames of most the members in the server'
    })
  }

  async execute(msg) {
    if (admins[msg.author.id] && servers[msg.guild.id]) {
      msg.guild.members.fetch({ user: Object.keys(users) })
        .then(guildMembers => Promise.all(guildMembers.map(this.resetNickname)))
        .finally(() => msg.reply('Server reset'))
    }
  }

  async resetNickname (guildMember) {
    const user = users[guildMember.user.id]
    return (user && user.nick !== guildMember.nickname)
      ? guildMember.setNickname(user.nick, REASONING)
      : Promise.resolve()
  }
}