import { Injectable } from '@nestjs/common';
import { MusicType } from 'src/common/enum/music-type';
import { Music } from 'src/entities/music.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MusicRepository extends Repository<Music> {
  async getLimitedMusics(limit: number): Promise<Music[]> {
    const query = this.createQueryBuilder('music').select();
    if (limit) {
      query.limit(limit);
    }
    const musics = await query
      .leftJoinAndSelect('music.tracks', 'track')
      .getMany();
    return musics;
  }

  async getFilteredMusics(
    limit: number,
    type: MusicType,
    rate: number,
  ): Promise<Music[]> {
    const query = this.createQueryBuilder('music').select();
    if (limit) {
      query.limit(limit);
    }
    if (type) {
      query.where('music.type = :type', { type });
    }
    if (rate) {
      query.andWhere('music.rate = :rate', { rate });
    }
    const musics = await query
      .leftJoinAndSelect('music.tracks', 'track')
      .getMany();
    return musics;
  }
}
