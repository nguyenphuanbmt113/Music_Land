import { Injectable } from '@nestjs/common';
import { ArtistType } from 'src/common/enum/artist.enum';
import { GENDER } from 'src/common/enum/gender.enum';
import { Singer } from 'src/entities/singer.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ArtistRepository extends Repository<Singer> {
  constructor(private dataSource: DataSource) {
    super(Singer, dataSource.createEntityManager());
  }
  async getLimitedSinger(limit: number) {
    const query = this.createQueryBuilder('singer').select();
    if (limit) {
      query.limit(limit);
    }
    const singers = await query
      .leftJoinAndSelect('singer.singerAlbums', 'singerAlnums')
      .getMany();
    return singers;
  }
  async filterSinger(
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
