import { Injectable } from '@nestjs/common';
import { ArtistType } from 'src/common/enum/artist.enum';
import { GENDER } from 'src/common/enum/gender.enum';
import { Musician } from 'src/entities/musician.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MusicianRepository extends Repository<Musician> {
  async getLimitedMusician(limit: number) {
    const query = this.createQueryBuilder('singer').select();
    if (limit) {
      query.limit(limit);
    }
    const singers = await query
      .leftJoinAndSelect('singer.singerAlnums', 'singer-albums')
      .getMany();
    return singers;
  }
  async filterMusician(
    limit: number,
    nationality: string,
    type: ArtistType,
    gender: GENDER,
  ) {
    const query = this.createQueryBuilder('singer').select();
    if (limit) {
      query.limit(limit);
    }
    if (nationality) {
      query.where('singer.nationality LIKE :nationality', { nationality });
    }
    if (type) {
      query.andWhere('singer.type = :type', { type });
    }
    if (gender) {
      query.andWhere('singer.gender = :gender', { gender });
    }
    const singers = await query
      .leftJoinAndSelect('singer.singerAlbums', 'singer-albums')
      .getMany();
    return singers;
  }
}
