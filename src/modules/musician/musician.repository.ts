import { Injectable } from '@nestjs/common';
import { ArtistType } from 'src/common/enum/artist.enum';
import { GENDER } from 'src/common/enum/gender.enum';
import { Musician } from 'src/entities/musician.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MusicianRepository extends Repository<Musician> {
  constructor(private dataSource: DataSource) {
    super(Musician, dataSource.createEntityManager());
  }
  async getLimitedMusicians(limit: number): Promise<Musician[]> {
    const query = this.createQueryBuilder('musician').select();
    if (limit) {
      query.limit(limit);
    }
    const musicians = await query
      .leftJoinAndSelect('musician.musicianAlbums', 'musician-album')
      .getMany();
    return musicians;
  }

  async getFilteredMusicians(
    limit: number,
    nationality: string,
    type: ArtistType,
    gender: GENDER,
  ): Promise<Musician[]> {
    const query = this.createQueryBuilder('musician').select();
    if (limit) {
      query.limit(limit);
    }
    if (nationality) {
      query.where('musician.nationality LIKE :nationality', { nationality });
    }
    if (type) {
      query.andWhere('musician.type = :type', { type });
    }
    if (gender) {
      query.andWhere('musician.gender = :gender', { gender });
    }
    const musicians = await query
      .leftJoinAndSelect('musician.musicianAlbums', 'musician-album')
      .getMany();
    return musicians;
  }
}
