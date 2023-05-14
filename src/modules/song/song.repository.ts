import { Injectable } from '@nestjs/common';
import { SongLanguage } from 'src/common/enum/song-lang';
import { SongType } from 'src/common/enum/song-type';
import { Song } from 'src/entities/song.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SongRepository extends Repository<Song> {
  constructor(private dataSource: DataSource) {
    super(Song, dataSource.createEntityManager());
  }
  async getLimitedSongs(limit: number): Promise<Song[]> {
    const query = this.createQueryBuilder('song').select();
    if (limit) {
      query.limit(limit);
    }
    const songs = await query
      .leftJoinAndSelect('song.tracks', 'track')
      .getMany();
    return songs;
  }

  async getFilteredSongs(
    limit: number,
    type: SongType,
    language: SongLanguage,
    rate: number,
  ): Promise<Song[]> {
    const query = this.createQueryBuilder('song').select();
    if (limit) {
      query.limit(limit);
    }
    if (type) {
      query.where('song.type = :type', { type });
    }
    if (language) {
      query.andWhere('song.language = :language', { language });
    }
    if (rate) {
      query.andWhere('song.rate = :rate', { rate });
    }
    const songs = await query
      .leftJoinAndSelect('song.tracks', 'track')
      .getMany();
    return songs;
  }
}
