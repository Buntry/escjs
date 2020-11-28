import Command from "../models/Command.js";
import admins from "../data/admins.js";
import users from "../data/users.js";
import servers from "../data/servers.js";
import shuffle from "../lib/shuffle.js";

const REASONING = 'Scrambling nicknames server-wide'

export default class Scramble extends Command {
  constructor() {
    super({
      commandName: 'scramble',
      helpMessage: 'scrambles the nicknames of most the users in the server',
      hidden: true
    })
  }

  async execute(msg) {
    if (admins[msg.author.id] && servers[msg.guild.id]) {
      const nicknameMap = this.generateNicknameMap()

      msg.guild.members.fetch({ user: Object.keys(users) })
        .then(guildMembers => Promise.all(guildMembers.map(gm => this.resetNickname(gm, nicknameMap))))
        .finally(() => msg.reply('Server scrambled'))
    }
  }

  generateNicknameMap() {
    const userKeys = Object.keys(users)
    const userValues = Object.values(users)
    const nicknameMap = {}
    shuffle(userValues)

    for (let i = 0; i < userKeys.length; i += 1) {
      nicknameMap[userKeys[i]] = userValues[i]
    }

    return nicknameMap
  }

  async resetNickname (guildMember, nicknameMap) {
    const user = nicknameMap[guildMember.user.id]
    return (user && user.nick !== guildMember.nickname)
      ? guildMember.setNickname(user.nick, REASONING)
      : Promise.resolve()
  }
}