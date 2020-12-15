import dotenv from 'dotenv'
import admin from 'firebase-admin'

dotenv.config()

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID
const FIREBASE_CONFIG = process.env.FIREBASE_CONFIG

const database = PROJECT_ID
  && FIREBASE_CONFIG
  && admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(FIREBASE_CONFIG)),
    databaseURL: `https://${PROJECT_ID}.firebaseio.com` 
  })
  && admin.database()

export default database
