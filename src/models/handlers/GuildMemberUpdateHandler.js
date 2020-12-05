import DiscordEventHandler from './DiscordEventHandler.js'

export default class GuildMemberUpdateHandler extends DiscordEventHandler {
  constructor({ shouldRun } = { shouldRun: () => false }) {
    super({ discordEvent: 'guildMemberUpdate' })
    this.shouldRun = shouldRun
  }

  execute(oldMember, newMember) {
    if (this.shouldRun(oldMember, newMember)) {
      this.handle(oldMember, newMember)
    }
  }

  handle(oldMember, newMember) {
    throw new Error(`Basic Guild Member Update Handler not implemented.
    ${oldMember} to ${newMember}`)
  }
}