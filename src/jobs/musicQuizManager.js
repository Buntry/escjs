import sequentialTimes from "../lib/sequentialTimes.js"
import sleep from "../lib/sleep.js"

export default class MusicQuizManager {
  constructor(msg, connection) {
    this.msg = msg
    this.channel = msg?.channel
    this.connection = connection
    this.finish = () => {}
    this.fail = () => {}
    this.roundLimit = 3
    this.roundLength = 30000
  }

  onFinish(func) { this.finish = func; return this }
  onFail(func) { this.fail = func; return this }

  async startQuiz() {
    console.log('starting quiz')
    sleep(1000)
      .then(() => sequentialTimes(this.roundLimit, this.performRound))
      .then(this.finish)
    return this
  }

  performRound(roundNumber) {
    console.log('performing round ' + roundNumber)
    const song = { artist: 'parker', songName: 'meme' }
    const messageMatchFilter = msg => Object.values(song).some(el => msg?.content?.includes(el))

    console.log('performing round this', this)
    const collector = 
      this.channel?.createMessageCollector(messageMatchFilter, { time: this.roundLength })
    
    this.channel?.send(`Guess this super secret song for round ${roundNumber + 1}`)
    collector?.on('collect', msg => this.handleCollect(roundNumber, msg, song, collector))
    collector?.on('end', collection => collection?.size > 0 
      ? this.channel?.send('Someone got the right answer') 
      : this.channel?.send('No one got the answer'))
    
    return sleep(5000)
  }

  handleCollect(roundNumber, msg, song, collector) {
    console.log('collected round ' + roundNumber)
    msg?.reply(`You guess it right! The song was ${song.songName} by ${song.artist}.`)
    collector?.stop()
  }
}