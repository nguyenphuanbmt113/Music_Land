import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicRepository } from './music.repository';
import { PlaylistService } from '../playlist/playlist.service';
import { FavoriteService } from '../favorite/favorite.service';
import { Music } from 'src/entities/music.entity';
import { MusicType } from 'src/common/enum/music-type';
import { StrackService } from '../strack/strack.service';
import { Track } from 'src/entities/track.entity';
import * as fs from 'fs';
@Injectable()
export class MusicService {
  constructor(
    @InjectRepository(MusicRepository) private musicRepository: MusicRepository,
    private favService: FavoriteService,
    private playlistService: PlaylistService,
    private trackService: StrackService,
  ) {}

  async getAllMusics(): Promise<Music[]> {
    return await this.musicRepository.find();
  }

  async getMusicById(id: number): Promise<Music> {
    const music = await this.musicRepository.findOne({
      where: {
        id,
      },
    });
    if (!music) {
      throw new NotFoundException(`Music with id ${id} does not found`);
    }
    return music;
  }

  async getFilteredMusics(
    limit: number,
    type: MusicType,
    rate: number,
  ): Promise<Music[]> {
    return await this.musicRepository.getFilteredMusics(limit, type, rate);
  }

  async getLimitedMusics(limit: number): Promise<Music[]> {
    return await this.musicRepository.getLimitedMusics(limit);
  }

  async updateMusic(
    id: number,
    name: string,
    description: string,
    artist: string,
    type: MusicType,
    source: any,
  ): Promise<Music> {
    const music = await this.getMusicById(id);
    if (name) {
      music.name = name;
    }
    if (description) {
      music.description = description;
    }
    if (artist) {
      music.artist = artist;
    }
    if (type) {
      music.type = type;
    }

    if (source) {
      fs.unlinkSync(music.source);
      music.source = source.path;
    }
    const updatedMusic = await music.save();
    return updatedMusic;
  }

  async deleteMusic(id: number) {
    const music = await this.getMusicById(id);
    for (let i = 0; i < music.tracks.length; i++) {
      await this.trackService.deleteTrack(music.tracks[i].id);
    }
    if (music.source) {
      //delete sourse
    }
    const result = await this.musicRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Music with id ${id} does not found`);
    }
    return result;
  }

  async pushToFavoriteList(
    musicId: number,
    favoriteListId: number,
  ): Promise<Track> {
    const music = await this.getMusicById(musicId);
    const track = await this.favService.createFavoriteTrack(
      null,
      music,
      favoriteListId,
    );
    return track;
  }

  async pushToPlaylist(musicId: number, playlistId: number): Promise<Track> {
    const music = await this.getMusicById(musicId);
    const track = await this.playlistService.createPlaylistTrack(
      null,
      music,
      playlistId,
    );
    return track;
  }
}
