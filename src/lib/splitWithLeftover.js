import _ from 'lodash'

export default (str, pattern, limit, joining = ' ') => {
  const matches = _.split(str, pattern)
  return matches.length > limit 
    ? [...matches.slice(0, limit-1), _.join(matches.slice(limit-1, matches.length), joining)]
    : matches
}