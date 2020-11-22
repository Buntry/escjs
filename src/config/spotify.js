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

const isType = (query, type) => {
  try {
    return spotifyUri.parse(query)?.type === type
  } catch (err) {
    return false
  }
}

export const isTrack = (query) => isType(query, 'track')
export const isPlaylist = (query) => isType(query, 'playlist')

export const getSpotifyId = (query) => spotifyUri.parse(query)?.id

export const getTrack = async (trackId) => {
  return refreshToken().then(() => spotifyApi.getTrack(trackId))
}

export const getPlaylist = async (playlistId) => {
  return refreshToken().then(() => spotifyApi.getPlaylist(playlistId))
}

export const getPlaylistTracks = async (playlistId) => {
  await refreshToken()

  const tracks = []
  let total = 0
  let offset = 0

  do {
    const playlistTracks = await spotifyApi.getPlaylistTracks(playlistId, { offset })
    playlistTracks?.body?.items?.forEach(trackInfo => tracks.push(trackInfo))
    
    total = playlistTracks?.body?.total
    offset += playlistTracks?.body?.limit
  } while (total > offset)

  return tracks
}

export default {
  isTrack, isPlaylist, getSpotifyId, getTrack, getPlaylist, getPlaylistTracks
}
