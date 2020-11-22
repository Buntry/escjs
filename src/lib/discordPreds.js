import { getMusicManager } from "../jobs/musicManager.js"

export const IN_GUILD = msg => ({ 'You must be in a guild to use this command': msg?.guild })
export const IN_VC = msg => ({'You must be in a voice channel to use this command': msg?.member?.voice?.channel})

export const IN_GUILD_VC = msg => ({...IN_GUILD(msg), ...IN_VC(msg)})
export const HAS_MUSIC_MANAGER = msg => ({...IN_GUILD_VC(msg), 
  'The bot must be connected in order to use this command': getMusicManager(msg, {createIfNotFound: false})
})