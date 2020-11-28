import _ from 'lodash'

export default class Leaderboard {
  constructor() {
    this.userScores = {}
    this.currentRoundScores = {}
  }

  getScores() { return this.userScores }

  roundAward(uid, score=0) {
    this.currentRoundScores[uid] = score
  }

  commitRound() {
    _.mergeWith(this.userScores, this.currentRoundScores, (v1, v2) => (v1 || 0) + (v2 || 0))
    this.currentRoundScores = {}
  }
}