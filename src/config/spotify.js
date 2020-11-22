import SpotifyWebApi from 'spotify-web-api-node'
import spotifyUri from 'spotify-uri'
import dayjs from 'dayjs'

let spotifyLastRequestedToken = null

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
})

const setup = async () => spotifyApi.clientCredentialsGrant()
  .then(data => data?.body?.access_token, console.err)

const setToken = (token) => spotifyApi.setAccessToken(token)

const refreshToken = async () => {
  return (spotifyLastRequestedToken === null || dayjs().diff(spotifyLastRequestedToken, 'm') > 58) 
    ? setup().then(setToken)
    : Promise.resolve()
}

export const isTrack = (query) => {
  try {
    const parsed = spotifyUri.parse(query)
    return parsed?.type === 'track'
  } catch (err) {
    return false
  }
}

export const getTrackId = (query) => {
  const parsed = spotifyUri.parse(query)
  return parsed?.id
}

export const getTrack = async (trackId) => {
  return refreshToken().then(() => spotifyApi.getTrack(trackId))
}

export default {
  isTrack, getTrackId, getTrack
}
