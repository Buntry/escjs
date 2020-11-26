import DiscordEventHandler from './DiscordEventHandler.js'

export default class VoiceStateUpdateHandler extends DiscordEventHandler {
  constructor({ shouldRun } = { shouldRun: () => false }) {
    super({ discordEvent: 'voiceStateUpdate' })
    this.shouldRun = shouldRun
  }

  execute(oldMember, newMember) {
    if (this.shouldRun(oldMember, newMember)) {
      this.handle(oldMember, newMember)
    }
  }

  handle(oldMember, newMember) {
    throw new Error(`Basic Voice State Update Handler not implemented.
    ${oldMember} to ${newMember}`)
  }
}