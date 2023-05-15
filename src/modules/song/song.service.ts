import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SongLanguage } from 'src/common/enum/song-lang';
import { SongType } from 'src/common/enum/song-type';
import { Song } from 'src/entities/song.entity';
import { DeleteResult } from 'typeorm';
import { SongRepository } from './song.repository';
import { PlaylistService } from '../playlist/playlist.service';
import { FavoriteService } from '../favorite/favorite.service';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(SongRepository) private songRepository: SongRepository,
    private playlistService: PlaylistService,
    private favoriteService: FavoriteService,
  ) {}

  async getAllSongs(): Promise<Song[]> {
    return await this.songRepository.find();
  }

  async getSongById(id: number): Promise<Song> {
    const song = await this.songRepository.findOne({
      where: {
        id,
      },
    });
    if (!song) {
      throw new NotFoundException(`Song with id ${id} does not found`);
    }
    return song;
  }

  async getFilteredSong(
    limit: number,
    type: SongType,
    language: SongLanguage,
    rate: number,
  ): Promise<Song[]> {
    return await this.songRepository.getFilteredSongs(
      limit,
      type,
      language,
      rate,
    );
  }

  async getLimitedSongs(limit: number): Promise<Song[]> {
    return await this.songRepository.getLimitedSongs(limit);
  }

  async updateSong(
    id: number,
    name: string,
    description: string,
    artist: string,
    type: SongType,
    language: SongLanguage,
    source: any,
  ): Promise<Song> {
    const song = await this.getSongById(id);
    if (name) {
      song.name = name;
    }
    if (description) {
      song.description = description;
    }
    if (artist) {
      song.artist = artist;
    }
    if (type) {
      song.type = type;
    }
    if (language) {
      song.language = language;
    }
    if (source) {
      song.source = source;
    }
    const updatedSong = await song.save();
    return updatedSong;
  }

  async deleteSong(id: number): Promise<DeleteResult> {
    const result = await this.songRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Song with id ${id} does not found`);
    }
    return result;
  }

  async addSongToPlaylist(songId: number, playlistId: number) {
    const song = await this.getSongById(songId);
    const track = await this.playlistService.createPlaylistTrack(
      song,
      null,
      playlistId,
    );
    if (track) {
      song.tracks = [track];
    }
    await song.save();
    return 'okela add song to playlist';
  }

  async addSongToFavorite(songId: number, favoriteId: number) {
    const song = await this.getSongById(songId);
    const track = await this.favoriteService.createFavoriteTrack(
      song,
      null,
      favoriteId,
    );
    song.tracks = [track];
    return 'okela add song to favorite';
  }
}
