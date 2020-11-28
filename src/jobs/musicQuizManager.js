import _ from 'lodash'
import ytdl from 'ytdl-core'
import prefix from '../config/prefix.js'
import { MessageEmbed } from 'discord.js'
import { compareTwoStrings } from 'string-similarity'
import { getMusicManager, mapMusicManager } from "./musicManager.js"
import Leaderboard from '../lib/leaderboard.js'
import sequentialTimes from '../lib/sequentialTimes.js'
import checkPreds from '../lib/checkPreds.js'
import shuffle from '../lib/shuffle.js'
import sleep from '../lib/sleep.js'

const PAREN_REGEX = /(.+) \(/
const DASH_REGEX = /(.+) -/

export default class MusicQuizManager {
  constructor(musicManager, numRounds = 5) {
    this.musicManager = musicManager
    this.numRounds = numRounds
    this.leaderboard = new Leaderboard()
    this.snippetLength = 40
    this.snippetPadding = 10
    this.textChannel = null
    this.messageCollector = null
    this.similarityThreshold = 0.65
    this.shouldStop = false
  }

  async startQuiz(msg) {
    const errMsg = this.checkCanStartQuiz(msg)
    if (errMsg) {
      msg?.reply(errMsg)
    } else {
      this.textChannel = msg?.channel
      await this.prepMusicManager()
      this.sendWelcomeEmbed()
      await sequentialTimes(this.numRounds, (roundNum) => this.performRound(roundNum))
    }
    this.endQuiz(msg)
  }

  async performRound(roundNum) {
    if (this.shouldStop)
      return Promise.resolve()

    this.textChannel?.send(`Starting round number ${roundNum + 1}`)
    const snippetLengthMs = (this.snippetLength + this.snippetPadding) * 1000
    const song = this.musicManager?.songQueue?.[1]

    await sleep(this.snippetPadding)
    this.musicManager.skip()
    await this.listenForGuesses(snippetLengthMs, song)
    this.leaderboard.commitRound()
    this.showRoundStandings(roundNum, song)
  }

  async listenForGuesses(snippetLengthMs, song) {
    const name = _.lowerCase(song.name)
    const artist = _.lowerCase(song.artist)

    const notABot = (msg) => !msg?.author?.bot

    const blankTarget = {award: 1, recipient: null}
    const allTargets = {...blankTarget, award: 3, msg: 'You got both the song name and the artist! Here\'s 3pts!'}
    const targets = [
      {...blankTarget, target: name, msg: 'You correctly guessed the song name! Here\'s 1pt!'},
      {...blankTarget, target: artist, msg: 'You correctly guessed the artist! Here\'s 1pt!'},
    ]

    const noRecipients = () => targets.every(tgt => tgt.recipient === null)
    const shouldAward = (tgt, content, uid) => tgt.recipient === null 
      && (tgt.recipient === uid || compareTwoStrings(content, tgt.target) > this.similarityThreshold)

    const award = (uid, tgt, msg) => {
      this.leaderboard.roundAward(uid, tgt.award)
      tgt.recipient = uid
      msg?.reply(tgt.msg)
    }  

    const waitForNoAnswer = () => sleep(snippetLengthMs)
      .then(() => {
        if (noRecipients()) {
          this.textChannel?.send("Round's over. Looks like no one got any points that round.")
        }
      })

    return await Promise.race([waitForNoAnswer(), new Promise(resolve => {
      this.messageCollector = 
        this.textChannel?.createMessageCollector(notABot, { time: snippetLengthMs })
      this.messageCollector.on('collect', msg => {
        const content = _.lowerCase(msg?.content)
        const uid = msg?.author?.id

        targets.forEach(tgt => tgt.shouldAward = shouldAward(tgt, content, uid))

        if (targets.every(tgt => tgt.shouldAward || tgt.recipient === uid)) {
          award(uid, allTargets, msg)
        } else if (targets.some(tgt => tgt.shouldAward)) {
          targets.filter(tgt => tgt.shouldAward).forEach(tgt => award(uid, tgt, msg))
        } else {
          msg?.react('❌')
        }

        if (allTargets.recipient || targets.every(tgt => tgt.recipient)) {
          resolve(song)
          this.messageCollector?.stop()
        }
      })
      this.messageCollector.on('end', () => resolve(song))
    })])
  }

  async showRoundStandings(roundNum, song) {
    if (this.shouldStop) return
    
    const leaderboardText = _.chain(this.leaderboard.getScores())
      .toPairs()
      .sortBy(userScore => -userScore[1])
      .map((userScore, idx) => `\n${this.emojiForIdx(idx)}:\t${this.userFromUid(userScore[0])}\t${userScore[1]}pts`)
      .value()
      .join('\n')

    const songLinkText = `The song was **${song.name}** *by ${song.artist}*\n${song.url}`
    const title = roundNum + 1 === this.numRounds 
      ? `🎶 Finals Leaderboard 🎶`
      : `🎵 Round ${roundNum+1}/${this.numRounds} Leaderboard 🎵`

    this.textChannel?.send(new MessageEmbed()
      .setTitle(title)
      .setDescription(leaderboardText)
      .setColor(0xff4500))
    this.textChannel?.send(songLinkText)
  }

  emojiForIdx(idx) {
    switch (idx) {
    case 0: return '🥇'
    case 1: return '🥈'
    case 2: return '🥉'
    default: return `${idx + 1}`
    }
  }

  userFromUid(uid) {
    return this.textChannel?.guild?.members?.cache?.get(uid)
  }

  async prepMusicManager() {
    const songCopies = [...this.musicManager.songQueue]
    shuffle(songCopies)
    this.musicManager.clear()
    _.slice(songCopies, 0, this.numRounds).forEach(song => this.makeSongSnippet(song))
    songCopies.forEach(song => this.musicManager.songQueue.push(song))
  }

  makeSongSnippet(song) {
    const songLength = _.toNumber(song?.info?.videoDetails?.lengthSeconds)
    const snippetLength = this.snippetLength + this.snippetPadding
    const timestamp = _.random(0, songLength - snippetLength)
    if (songLength > snippetLength) {
      song.resource = () => ytdl(song.url, { begin: timestamp * 1000 })
    }

    [PAREN_REGEX, DASH_REGEX].forEach(regex => {
      if (regex.test(song.name)) {
        song.name = regex.exec(song.name)?.[1]
      }
    })

    song.name = song.name
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .replace(/s{2,}/g, ' ')
  }

  sendWelcomeEmbed() {
    const embedText = `This quiz will have **${this.numRounds} song** snippets.

    Try to guess the **artist** and **song name**!

    \`\`\`groovy
+ 1 point for artist
+ 1 point for song name
+ 3 points for both\`\`\`

    You can type ${prefix}skip to skip a song.
    Please wait ${this.snippetPadding} seconds for the quiz to start.

    **Enjoy the quiz!!**
    `

    this.textChannel?.send(new MessageEmbed()
      .setTitle('🎶 Quiz starting soon!')
      .setColor(0xff4500)
      .setDescription(embedText))
  }

  checkCanStartQuiz() {
    return checkPreds({
      [`There needs to be at least ${this.numRounds} songs in the queue to start a quiz.`]: 
        this.musicManager?.songQueue?.length >= this.numRounds
    })
  }

  endQuiz(msg) {
    if (this.shouldStop) return

    this.textChannel?.send('The quiz is over! Restoring regular music queue.')
    mapMusicManager(msg, musicQuizManager => musicQuizManager?.musicManager)
    getMusicManager(msg)?.shuffle()
  }

  cannotBlank(what) { this.textChannel?.send(`Cannot ${what} while quiz is going on!`) }
  clear() { this.cannotBlank('clear') }
  addSong() { this.cannotBlank('add a song') }
  pause() { this.cannotBlank('pause') }
  resume() { this.cannotBlank('resume') }
  skip() { this.messageCollector?.stop() }
  repeat() { this.cannotBlank('repeat') }
  shuffle() { this.cannotBlank('shuffle') }
  stop() { this.musicManager?.stop(); this.shouldStop = true; this.skip() }
}