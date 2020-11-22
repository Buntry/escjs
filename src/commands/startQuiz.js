import Command from "../models/Command.js"
import MusicQuizManager from '../jobs/musicQuizManager.js'
import { MessageEmbed } from 'discord.js'
import prefix from '../config/prefix.js'

export default class StartQuiz extends Command {
  constructor() {
    super({
      commandName: 'start-quiz',
      helpMessage: 'given a spotify link, creates a music guessing quiz'
    })
  }

  async execute(msg) {
    const conn = msg?.member?.voice?.channel?.join()?.then(
      connection => {
        this.sendWelcomeEmbed(msg)
        new MusicQuizManager(msg, connection)
          .onFinish(() => connection.disconnect())
          .onFail(() => connection.disconnect())
          .startQuiz()
      }
    )
    if (!conn) {
      return msg?.reply('You need to be in a voice channel to start a quiz')
    }
  }

  sendWelcomeEmbed(msg) {
    const embedText = `This quiz will have **10 song** snippets.

    Try to guess the **artist** and **song name**!

    \`\`\`
    + 1 point for artist
    + 1 point for song name
    + 3 points for both\`\`\`

    Quiz starter can type \`${prefix}skip\` to skip this song (before anyone has scored).

    **Enjoy the quiz!!**
    `

    const embed = new MessageEmbed()
      .setTitle('🎶 Quiz starting soon!')
      .setColor(0xff4500)
      .setDescription(embedText)

    msg.channel.send(embed)
  }
}