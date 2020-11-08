import firebase from "firebase"
import dotenv from 'dotenv'

dotenv.config()

const API_KEY = process.env.FIREBASE_API_KEY
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${PROJECT_ID}.firebaseio.com`,
  projectId: PROJECT_ID,
  storageBucket: `${PROJECT_ID}.appspot.com`,
  messagingSenderId: "325316984402",
  appId: "1:325316984402:web:be34b18ec83015b9a6698b"
}

const database = API_KEY
  && PROJECT_ID
  && firebase.initializeApp(firebaseConfig)
  && firebase.database()

export default database