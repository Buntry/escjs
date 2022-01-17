import _ from 'lodash'
import client from '../../index.js'
import sleep from "../lib/sleep.js"
import GuildMemberUpdateHandler from "../models/handlers/GuildMemberUpdateHandler.js"

const desiredNicknames = {
  '359047531231051777': 'EscBot[DEV]',
  '356219476523483137': 'EscBot'
}

const isBot = guildMember => guildMember?.user?.bot
const hasNick = guildMember => guildMember?.user?.id in desiredNicknames

const isBotAndChangedNickname = ([oldMember, newMember]) => {
  return isBot(oldMember) && isBot(newMember) 
  && newMember?.user?.id === oldMember?.user?.id
  && hasNick(oldMember) && hasNick(newMember)
  && newMember?.nickname !== null 
  && newMember?.nickname !== desiredNicknames[newMember?.user?.id]
}

export default class ChangeBotNicknameHandler extends GuildMemberUpdateHandler {
  constructor() {
    super({ shouldRun: isBotAndChangedNickname })
    this.responseTimeMin = 1000
    this.responseTimeMax = 5000
  }

  handle(states) {
    const newMember = states?.[1]
    const desiredNickname = desiredNicknames[newMember?.user?.id]

    sleep(_.random(this.responseTimeMin, this.responseTimeMax))
      .then(() => newMember?.setNickname(desiredNickname, 'Resetting back to desired nickname'))
  }
}

// Ready handler to change nicknames back 
client.on('ready', () => {
  client.guilds.cache.forEach(guild => {
    const botId = client?.user?.id
    guild?.members?.fetch(botId)
      .then(guildMember => {
        const currentNick = guildMember?.nickname
        const desiredNick = desiredNicknames[botId]

        if (currentNick && currentNick !== desiredNick) {
          guildMember?.setNickname(desiredNick, 'Resetting back to desired nickname')
        }
      })
  })
})