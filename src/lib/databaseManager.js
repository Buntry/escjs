import database from "../config/database.js"

export default class DatabaseManager {
  constructor() {
    this.database = database
    this.env = process.env.FIREBASE_DB_PREFIX
  }

  ref(refString) {
    return this.database.ref(`${this.env}/${refString}`)
  }
}