import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export class PrkrClient {
  constructor(endpoint, apikey) {
    this.endpoint = endpoint
    this.apikey = apikey
  }

  async _get(resource) {
    return axios.get(`${this.endpoint}${resource}`, { headers: { 'X-API-Key': this.apikey } })
  }

  async _post(resource, data) {
    return axios.post(`${this.endpoint}${resource}`, data, { headers: { 'X-API-Key': this.apikey } })
  }

  async getConnect4Profile(user) {
    return this._get(`/connect4/profile?discordUid=${user?.id}`)
      .then(response => response?.data)
  }

  async getConnect4Leaderboard() {
    return this._get('/connect4/leaderboard')
      .then(response => response?.data)
  }

  async createConnect4Game(player1, player2, amount) {
    return this._post('/game', {
      type: 'create',
      game: {
        name: 'connect4',
        players: [
          { discordUid: player1?.id, discordName: player1?.username },
          { discordUid: player2?.id, discordName: player2?.username }
        ],
        reward: amount
      }
    }).then(response => response?.data)
  }

  async getRewards(user, shouldRedeem=true) {
    return this._get(`/rewards?discordUid=${user?.id}&shouldRedeem=${shouldRedeem}`)
      .then(response => response?.data)
  }
}

export default new PrkrClient(process.env.PRKR_API_ENDPOINT, process.env.PRKR_API_KEY)