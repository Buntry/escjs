const toTwoDigitString = (num) => 
  (num).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})

export default (duration) => {
  const hour = duration?.hours() ? `${duration?.hours()}:` : ''
  return `${hour}${duration?.minutes()}:${toTwoDigitString(duration?.seconds())}`
}