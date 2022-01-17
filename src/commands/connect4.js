import _ from 'lodash'
import Category from '../data/category.js'
import CurrencyManager from '../lib/currencyManager.js'
import prefix from "../config/prefix.js"
import { MessageEmbed } from 'discord.js'
import prkr from '../prkr.ml/client.js'
import checkPreds from '../lib/checkPreds.js'
import challengeMessage from "../lib/challengeMessage.js"
import GameCommand from '../models/GameCommand.js'

export default class Connect4 extends GameCommand {
  constructor() {
    super({
      commandName: 'connect4',
      usage: 'connect4 <subcommand>',
      helpMessage: 'challenges someone to a game of connect4',
      category: Category.GAMES,
      argumentNames: ['subcommand', 'amt']
    })

    this.currencyManager = new CurrencyManager()
    this.subCommands = {
      'help': { help: 'displays list of connect4 sub-commands' },
      'play': { help: 'creates an open challenge to play a game of connect4', usage: 'play <amt>' },
      'profile': { help: 'gets your connect4 profile' },
      'leaderboard': { help: 'gets the top 10 connect4 players' }
    }
  }

  createEmbed(title) {
    return new MessageEmbed()
      .setColor(0xff4500)
      .setTitle(title)
      .setThumbnail('https://image.winudf.com/v2/image1/bXkuZ2FtZS5hZGFtc2NobG91Z2guY29ubmVjdDRfaWNvbl8xNTUxODI4MzYwXzAyOQ/icon.png?w=170&fakeurl=1')
  }

  sendEmbedWith(msg, description, title="", fields=[]) {
    let embed = this.createEmbed(title)
    if (description !== "") {
      embed = embed.setDescription(description)
    }
    embed.addFields(...fields)
    return msg?.channel?.send(embed)
  }

  getHelpDescription() {
    return Object.keys(this.subCommands).map(subCommand => {
      const subValue = this.subCommands[subCommand]
      if (subValue?.usage) {
        return `**${prefix}connect4 ${subValue.usage}**: ${subValue.help}`
      }
      return `**${prefix}connect4 ${subCommand}**: ${subValue.help}`
    }).join('\n')
  }

  profileNotFound() {
    return "It seems you don't have a connect4 profile yet, please play a game to receive a profile."
  }

  getProfile(msg, profile) {
    return [
      { 'name': 'User', 'value': msg?.author },
      { 'name': 'Rating', 'value': this.getRating(profile) },
      { 'name': 'Number of Games', 'value': profile?.connect4?.num_games }
    ]
  }

  getRating(profile) {
    return Math.round(profile?.connect4?.rating * 10)
  }

  async getLeaderboard(msg, leaderboard) {
    const discordUids = leaderboard?.map(player => player.discordUid)
    const members = await msg?.guild?.members?.fetch({ user: discordUids })
    
    
    const leaderboardText = leaderboard?.filter(player => members?.has(player.discordUid))
      ?.map((player, place) => {
        const guildUser = members?.get(player.discordUid)
        return `**${place+1}**: ${this.getRating(player)}\xa0|\xa0${guildUser?.user?.username}\xa0|\xa0${player.connect4.num_games}`
      })?.join("\n")

    return leaderboardText
  }

  getPlayPredicates(args) {
    return { "Please specify an amount to bet": _.isFinite(_.toNumber(args?.amt)) }
  } 

  async execute(msg, args) {
    if (!(args?.subcommand in this.subCommands)) {
      msg?.channel?.send(`No valid connect4 subcommand given, please type ${prefix}connect4 help for more info.`)
    } else if (args?.subcommand === 'help') {
      this.sendEmbedWith(msg, this.getHelpDescription())
    } else if (args?.subcommand === 'profile') {
      const profile = await prkr.getConnect4Profile(msg?.author)
      if (profile?.userFound) {
        this.sendEmbedWith(msg, "", "Connect4 Profile", this.getProfile(msg, profile))
      } else {
        this.sendEmbedWith(msg, this.profileNotFound())
      }
    } else if (args?.subcommand === 'leaderboard') {
      const response = await prkr.getConnect4Leaderboard()
      this.sendEmbedWith(msg, await this.getLeaderboard(msg, response?.leaderboard), "Connect4 Leaderboard")
    } else if (args?.subcommand === 'play') {
      const errMsg = checkPreds(this.getPlayPredicates(args))
      if (errMsg) {
        return msg?.channel?.send(errMsg)
      }
      this.playGame(msg, args)
    }
  }

  async playGame(msg, args) {
    const amt = Math.floor(_.toNumber(args?.amt))
    if (amt > 0) {
      challengeMessage(msg, amt, "Connect 4", 
        (channel, author, challenger, amt) => this.beginChallenge(channel, author, challenger, amt))
    }
  }

  async beginChallenge(channel, author, challenger, amount) {
    const game = await prkr.createConnect4Game(author, challenger, amount)
    channel?.send('Creating the game... links inbound. **Check your DMs!**')
    this.sendGameDMTo(author, game, amount)
    this.sendGameDMTo(challenger, game, amount)
  }

  async sendGameDMTo(user, game, amount) {
    const player = game?.players?.filter(player => player?.discordUid === user?.id)?.[0]
    return user?.send(this.createEmbed('Connect 4 Game Invite')
      .setDescription(`[Click to join](${player?.link}) for up to **${amount}** esc credits`))
  }
}