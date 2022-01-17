import dotenv from 'dotenv'
dotenv.config()

import Discord from 'discord.js'
import cmds from "./src/commands/cmds.js"
import getMessageArgs from './src/lib/getMessageArgs.js'
import getMessageCommand from './src/lib/getMessageCommand.js'
import eventHandlers from "./src/jobs/eventHandlers.js"

const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  setupEventHandlers()
})

client.on('message', msg => {
  try {
    const cmd = cmds.get(getMessageCommand(msg))
    cmd?.execute(msg, getMessageArgs(cmd, msg))
  } catch (err) {
    console.log(err)
  }
})

function setupEventHandlers() {
  eventHandlers.forEach((eventNameHandlers, eventName) => {
    eventNameHandlers.forEach(eventHandler => 
      client.on(eventName, (...args) => eventHandler.execute(args)))
  })
}

client.login(process.env.DISCORD_CLIENT_TOKEN)

export default client