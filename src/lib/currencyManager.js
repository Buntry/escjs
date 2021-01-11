import dayjs from "dayjs"
import DatabaseManager from "./databaseManager.js"

export default class CurrencyManager {
  constructor() {
    this.database = new DatabaseManager()
    this.startingBalance = Number(process.env.CURRENCY_START_BALANCE)
  }

  newUserAccount(existingUser, userId) {
    this.pushTransaction({toId: userId, amount: this.startingBalance, type: 'create', reason: 'create'})
    return { ...existingUser, uid: userId, creditBalance: this.startingBalance } 
  }
  userRef(userId) { return this.database.ref(`users/${userId}`) }
  getUserAcc(userId) { return this.userRef(userId).once('value').then(snapshot => snapshot.val()) }

  getAccount(userId) {
    return this.getUserAcc(userId).then(userAccount => {
      return userAccount?.creditBalance == null
        ? this.userRef(userId).set(this.newUserAccount(userAccount, userId)).then(() => this.getUserAcc(userId))
        : Promise.resolve(userAccount)
    })
  }

  async moveFunds(fromId, toId, amount, reason=null, type='general') {
    const fromAcc = await this.getAccount(fromId)
    if (fromAcc.creditBalance < amount) {
      return "Insufficient Funds"
    } else if (amount === 0) {
      return "Should not transfer 0 currency"
    }
    await this.getAccount(toId)

    this.database.ref(`users/${fromId}/creditBalance`)
      .transaction(bal => bal === null ? bal : Number(bal) - Number(amount))
    this.database.ref(`users/${toId}/creditBalance`)
      .transaction(bal => bal === null ? bal : Number(bal) + Number(amount))
    this.pushTransaction({ fromId, toId, amount, type, reason })
  }

  async pushTransaction(transaction) {
    this.database.ref(`transactions/`).push({...transaction, at: dayjs().unix() })
  }
}