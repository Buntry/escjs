import prefix from '../config/prefix.js'

const REGEX_PATTERN = `^\\s*${prefix}(\\w+)\\s*`
const MESSAGE_REGEX = new RegExp(REGEX_PATTERN)

export default (msg) => MESSAGE_REGEX.exec(msg?.content)?.[1]