import { Injectable, NotFoundException } from '@nestjs/common';
import { SongLanguage } from 'src/common/enum/song-lang';
import { SongType } from 'src/common/enum/song-type';
import { SongRepository } from './song.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/entities/song.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(SongRepository) private songRepository: SongRepository,
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
    // source: any,
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
    // if (source) {
    //   await this.awsService.fileDelete(song.source);
    //   song.source = await this.awsService.fileUpload(source, 'songs');
    // }
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
}
