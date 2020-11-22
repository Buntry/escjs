import dotenv from 'dotenv'
dotenv.config()

import Discord from 'discord.js'
import cmds from "./src/commands/cmds.js"
import getMessageArgs from './src/lib/getMessageArgs.js';
import getMessageCommand from './src/lib/getMessageCommand.js'

const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on('message', msg => {
  try {
    const cmd = cmds.get(getMessageCommand(msg))
    cmd?.execute(msg, getMessageArgs(cmd, msg))
  } catch (err) {
    console.log(err)
  }
})

client.login(process.env.DISCORD_CLIENT_TOKEN);
