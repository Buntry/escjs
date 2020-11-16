import { readdirSync } from 'fs'

const cmds = new Map()
export default cmds

readdirSync('./src/commands')
  .filter(file => file && file !== 'cmds.js')
  .map(async commandFile => {
    const commandMod = await import(`./${commandFile}`)
    const command = new commandMod.default()
    cmds.set(command.commandName, command)
  })
