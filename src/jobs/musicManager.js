import ytdl from 'ytdl-core'
import ytsr from 'youtube-sr'
import _ from 'lodash'
import Song from '../models/Song.js'
import shuffle from '../lib/shuffle.js'
import spotify from '../config/spotify.js'

class MusicManager {
  constructor(msg) {
    this.guildId = msg?.guild?.id
    this.textChannel = msg?.channel
    this.voiceChannel = msg?.member?.voice?.channel
    this.connection = null,
    this.songQueue = [],
    this.playing = false
    this.repeating = false
  }

  async startPlaying(song) {
    this.playing = song
    if (!this.playing) {
      return this.stop()
    }

    this.connection = this.connection || await this.voiceChannel?.join()
    this.connection?.play(song.resource())
      .on('finish', () => {
        const playedSong = this.songQueue.shift()
        if (this.repeating) this.songQueue.push(playedSong)
        this.startPlaying(_.head(this.songQueue))
      }).on('error', console.log)
  }

  async addSong(query) {
    const song = await this.getSongFromQuery(query)
    if (!song) 
      return this.textChannel?.send(`Could not find a resource from:\n${query}`)

    this.songQueue.push(song)
    this.sendAddedSongMsg(song)
    if (!this.playing) {
      this.startPlaying(song)
    }
  }

  async stop(msg) {
    this.connection?.disconnect()
    guilds.delete(this.guildId)
    if (msg)
      this.textChannel?.send(`${msg?.author} stopped the tunes 🎶`)
  }

  async pause() { this.connection?.dispatcher?.paused || this.connection?.dispatcher?.pause() }
  async resume() { !this.connection?.dispatcher?.paused || this.connection?.dispatcher?.resume() }
  async skip() { this.connection?.dispatcher?.end() }
  async repeat() { return this.repeating = !this.repeating }
  async clear() { this.songQueue = this.songQueue.slice(0, 1) }
  async shuffle() {
    const songCopies = [...this.songQueue]
    shuffle(songCopies)
    this.clear()
    songCopies.forEach(song => this.songQueue.push(song))
    this.skip()
  }

  sendAddedSongMsg(song) {
    this.textChannel?.send(`Added song **${song.name}** by ${song.artist}.`)
  }

  async getSongFromQuery(query) {
    if (this.isYTLink(query)) {
      return await this.getYTSong(query)
    } else if (spotify.isTrack(query)) {
      return await this.getSpotifySong(query)
    }

    return await this.searchYTForSong(query)
  } 

  isYTLink(query) { 
    return /https:\/\/www\.youtube\.com\/watch\?v=\S+/.test(query) 
    || /https:\/\/youtu\.be\/\S+/.test(query)
  }

  async getYTSong(query, title=null, artist=null) {
    const link = _.split(query, /\s+/, 1)?.[0]
    const info = await ytdl.getInfo(link)
    const videoDetails = info?.videoDetails
    return new Song(
      title || videoDetails?.title, 
      artist || videoDetails?.ownerChannelName, 
      () => ytdl(link), 
      info)
  }

  async searchYTForSong(query, title=null, artist=null) {
    const searchResults = await ytsr.searchOne(query)
    if (searchResults) {
      const link = `https://youtube.com/watch?v=${searchResults?.id}`
      return await this.getYTSong(link, 
        title || searchResults?.title,
        artist || searchResults?.channel?.name)
    }
  }

  async getSpotifySong(query) {
    const track = await spotify.getTrack(spotify.getTrackId(query))
    const title = track?.body?.name
    const artistName = track?.body?.artists?.[0]?.name
    return await this.searchYTForSong(`${title} by ${artistName}`, title, artistName)
  }
}

const guilds = new Map()
export const getMusicManager = (msg, { createIfNotFound } = { createIfNotFound: true}) => {
  const guildId = msg?.guild?.id
  if (!guilds.has(guildId) && createIfNotFound) {
    guilds.set(guildId, new MusicManager(msg))
  }
  return guilds.get(guildId)
}