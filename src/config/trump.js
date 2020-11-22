import axios from 'axios'

const getRandomQuote = async () => {
  return await axios.get('https://api.whatdoestrumpthink.com/api/v1/quotes/random')
    .then(res => res?.data?.message)
}

export default getRandomQuote