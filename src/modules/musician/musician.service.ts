import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistType } from 'src/common/enum/artist.enum';
import { GENDER } from 'src/common/enum/gender.enum';
import { MusicianAlbum } from 'src/entities/musician-album.entity';
import { Musician } from 'src/entities/musician.entity';
import { MusicianRepository } from './musician.repository';

@Injectable()
export class MusicianService {
  constructor(
    @InjectRepository(MusicianRepository)
    private musicianRepository: MusicianRepository,
  ) {}

  //localhost:3000/singers
  async findAll() {
    return await this.musicianRepository.find();
  }

  //localhost:3000/musicians/limited
  async getLimitSingers(limit: number) {
    const musicians = await this.musicianRepository.getLimitedMusicians(limit);
    return musicians;
  }
  //localhost:3000/musicians/filtered
  async getFilterSingers(
    limit: number,
    nationality: string,
    type: ArtistType,
    gender: GENDER,
  ) {
    const musicians = await this.musicianRepository.getFilteredMusicians(
      limit,
      nationality,
      type,
      gender,
    );
    return musicians;
  }

  //localhost: 3000/musicians/:id
  async findSingerById(id: number) {
    return await this.musicianRepository.findOne({
      where: { id },
    });
  }
  //localhost:3000/musicians/new-singer
  async createSinger(data: any) {
    const n_musician = new Musician();
    n_musician.name = data.name;
    n_musician.info = data.info;
    n_musician.image = data.image;
    n_musician.type = data.type;
    n_musician.gender = data.gender;
    n_musician.nationality = data.nationality;
    n_musician.musicianAlbums = [];

    const artist = await n_musician.save();
    return artist;
  }
  //localhost:3000/musicians/:id/new-album
  async createAlbum(musicianId: number, data: any) {
    const musician = await this.musicianRepository.findOne({
      where: { id: musicianId },
    });
    const album = new MusicianAlbum();
    album.name = data.name;
    album.image = data.image;
    album.musician = musician;
    const nalbum = await album.save();
    return nalbum;
  }
  //localhost:3000/musicians/:id/update-musician
  async updateSinger(id: number, data: any): Promise<Musician> {
    const musician = await this.findSingerById(id);
    if (data.name) {
      musician.name = data.name;
    }
    if (data.info) {
      musician.info = data.info;
    }
    if (data.gender) {
      musician.gender = data.gender;
    }
    if (data.nationality) {
      musician.nationality = data.nationality;
    }
    if (data.type) {
      musician.type = data.type;
    }
    if (data.image) {
      // await this.awsService.fileDelete(singer.image);
      // singer.image = await this.awsService.fileUpload(image, 'singer-images');
      musician.image = data.image;
    }
    const savedSinger = await musician.save();
    return savedSinger;
  }

  //deleteSinger
  async deleteSinger(singerId: number) {
    const musician = await this.findSingerById(singerId);
    const result = await musician.remove();
    return result;
  }
}
