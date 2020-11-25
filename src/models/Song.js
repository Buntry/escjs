export default class Song {
  constructor(name, artist, resource, url, info = {}) {
    this.name = name
    this.artist = artist
    this.resource = resource
    this.url = url
    this.info = info
  }
}