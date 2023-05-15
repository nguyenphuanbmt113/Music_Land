import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaylistRepository } from './playlist.repository';
import { StrackService } from '../strack/strack.service';
import { Song } from 'src/entities/song.entity';
import { Music } from 'src/entities/music.entity';
import { Playlist } from 'src/entities/playlist.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class PlaylistService {
  constructor(
    private playlistRepository: PlaylistRepository,
    private trackService: StrackService,
  ) {}

  async findAll() {
    const playlists = await this.playlistRepository.find();
    return playlists;
  }

  async getPlaylistById(id: number): Promise<Playlist> {
    const playlist = await this.playlistRepository.findOne({
      where: {
        id,
      },
    });
    if (!playlist) {
      throw new NotFoundException(`Playlist with Id ${id} Does not found`);
    }
    return playlist;
  }

  async getUserPlaylist(user: User) {
    const playlists = await this.playlistRepository.getUserPlaylists(user.id);
    return playlists;
  }

  async createPlaylistTrack(song: Song, music: Music, playlistId: number) {
    const playlist = await this.getPlaylistById(playlistId);
    const track = this.trackService.pushToPlaylist(song, music, playlist);
    return track;
  }

  async createUserPlaylist(user: User, data: any) {
    const playlist = new Playlist();
    playlist.name = data.name;
    playlist.createdAt = new Date();
    playlist.userId = user.id;
    const n_playlist = await playlist.save();
    return n_playlist;
  }

  async editPlaylist(id: number, data: any) {
    const playlist = await this.getPlaylistById(id);
    playlist.name = data.name;
    const update = await playlist.remove();
    return update;
  }

  async deletePlaylist(id: number) {
    const playlist = await this.getPlaylistById(id);
    if (!playlist) {
      throw new NotFoundException(`Playlist with Id ${id} Does not found`);
    }
    await playlist.remove();
  }

  async clearPlaylistContent(id: number) {
    const playlist = await this.getPlaylistById(id);
    for (let i = 0; i < playlist.tracks.length; i++) {
      await this.trackService.deleteTrack(playlist.tracks[i].id);
    }
    playlist.tracks = [];
    return await playlist.save();
  }

  async removeTrackFromPlaylist(
    playlistId: number,
    trackId: number,
  ): Promise<Playlist> {
    const playlist = await this.getPlaylistById(playlistId);
    for (let i = 0; i < playlist.tracks.length; i++) {
      if (playlist.tracks[i].id === trackId) {
        await this.trackService.deleteTrack(trackId);
        playlist.tracks.splice(i, 1);
        break;
      }
    }
    return await playlist.save();
  }
}
/*
- localhost:3000/playlists --> Root Route (GET Method - Main-Endpoint - Controller Name)
- localhost:3000/playlists/:id -->  (GET Method)
- localhost:3000/playlists/user-play-lists -->  (GET Method)
- localhost:3000/playlists/new-user-playlist -->  (POST Method)
- localhost:3000/playlists/:id/update-playlist-->  (PUT Method)

- localhost:3000/playlists/:id/delete-playlist-->  (DELETE Method)
- localhost:3000/playlists/:id/clear-playlist-content-->  (DELETE Method)
- localhost:3000/playlists/:playlistId/remove-track-from-playlist/:trackId -->  (DELETE Method)

*/
