import crypto from 'crypto'
import dayjs from "dayjs";

// In-memory user-id / hexcode map
export const DYNAMIC_UID_MAP = new Map()

export const generateUIDHash = uid => {
  const now = dayjs()
  if (!DYNAMIC_UID_MAP.has(uid) || dayjs(DYNAMIC_UID_MAP.get(uid).date).diff(now, 'day')) {
    const hash = crypto.createHash('sha256')
    hash.update(uid)
    hash.update(`${now.valueOf()}`) // Add epoch salt

    const hexCode = hash.digest('hex')
    const date = now.format('YYYY-MM-DD')
    DYNAMIC_UID_MAP.set(uid, { hexCode, date })
  }
  return DYNAMIC_UID_MAP.get(uid)
}

export const displayHex = ({ hexCode }) => hexCode.substring(0, 6)
