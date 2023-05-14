import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'src/entities/favorite.entity';
import { Music } from 'src/entities/music.entity';
import { Playlist } from 'src/entities/playlist.entity';
import { Song } from 'src/entities/song.entity';
import { Track } from 'src/entities/track.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StrackService {
  constructor(
    @InjectRepository(Track) private trackRepository: Repository<Track>,
  ) {}

  async pushToFavoriteList(song: Song, music: Music, favorite: Favorite) {
    let track = new Track();
    track = this.checkTrackType(track, song, music);
    track.favorite = favorite; // / creation of a foreign key called favoriteId
    return await track.save();
  }
  async pushToPlaylist(song: Song, music: Music, playlist: Playlist) {
    let track = new Track();
    track = this.checkTrackType(track, song, music);
    track.playlist = playlist; // creation of a foreign key called playlistId
    return await track.save();
  }
  checkTrackType(track: Track, song: Song, music: Music) {
    if (song) {
      track.song = song;
      track.title = song.name;
      track.link = song.source;
    } else if (music) {
      track.music = music;
      track.title = music.name;
      track.link = music.source;
    }
    return track;
  }
  async deleteTrack(id: number) {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Track with Id ${id} Does not found`);
    }
    return result;
  }
}
