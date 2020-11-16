import _ from 'lodash'
import prefix from '../config/prefix.js'
import splitWithLeftover from './splitWithLeftover.js'

const REGEX_PATTERN = `^\\s*${prefix}(\\w+.*)`
const MESSAGE_REGEX = new RegExp(REGEX_PATTERN)

export default (cmd, msg) => {
  return Object.fromEntries(_.zipWith(
    [cmd?.commandName, ...cmd?.argumentNames], 
    splitWithLeftover(MESSAGE_REGEX.exec(msg?.content)?.[1], /\s+/, cmd?.argumentNames?.length + 1),
    (argName, argValue) => [argName, argValue])
    .filter(entry => entry[0]))
}