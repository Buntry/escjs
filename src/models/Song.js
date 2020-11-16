export default class Song {
  constructor(name, artist, resource, info = {}) {
    this.name = name
    this.artist = artist
    this.resource = resource
    this.info = info
  }
}