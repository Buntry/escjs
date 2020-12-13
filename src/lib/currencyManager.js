import DatabaseManager from "./databaseManager.js";

export default class CurrencyManager {
  constructor() {
    this.database = new DatabaseManager()
    this.startingBalance = Number(process.env.CURRENCY_START_BALANCE)
  }

  newUserAccount(userId) { return { uid: userId, creditBalance: this.startingBalance } }
  userRef(userId) { return this.database.ref(`users/${userId}`) }
  getUserAcc(userId) { return this.userRef(userId).once('value').then(snapshot => snapshot.val()) }

  getAccount(userId) {
    return this.getUserAcc(userId).then(userAccount => {
      return userAccount == null
        ? this.userRef(userId).set(this.newUserAccount(userId)).then(() => this.getUserAcc(userId))
        : Promise.resolve(userAccount)
    })
  }

  async moveFunds(fromId, toId, amount) {
    const fromAcc = await this.getAccount(fromId)
    if (fromAcc.creditBalance < amount) {
      return "Insufficient Funds"
    } else if (amount === 0) {
      return "Should not transfer 0 currency"
    }
    await this.getAccount(toId)

    
    this.database.ref(`users/${fromId}/creditBalance`)
      .transaction(bal => bal === null ? bal : bal - amount)
    this.database.ref(`users/${toId}/creditBalance`)
      .transaction(bal => bal === null ? bal : bal + amount)
  }
}