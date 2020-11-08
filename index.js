import Discord from 'discord.js'
import dotenv from 'dotenv'
import cmds from "./src/commands/cmds.js"

dotenv.config()
const client = new Discord.Client()

const PREFIX = process.env.BOT_COMMAND_PREFIX

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on('message',async (msg) => {
  cmds.filter((cmd) => msg.content.startsWith(`${PREFIX}${cmd.commandName}`))
    .map(cmd => cmd.execute(msg))
});

client.login(process.env.DISCORD_CLIENT_TOKEN);
