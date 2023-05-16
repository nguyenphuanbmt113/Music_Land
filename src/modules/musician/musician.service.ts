import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
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
  async getLimitMusicians(limit: number) {
    const musicians = await this.musicianRepository.getLimitedMusicians(limit);
    return musicians;
  }
  //localhost:3000/musicians/filtered
  async getFilterMusicians(
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
  async findMusicianById(id: number) {
    return await this.musicianRepository.findOne({
      where: { id },
    });
  }
  //localhost:3000/musicians/new-Musician
  async createMusician(
    name: string,
    info: string,
    gender: GENDER,
    type: ArtistType,
    nationality: string,
    image: any,
  ) {
    const n_musician = new Musician();
    n_musician.name = name;
    n_musician.info = info;
    n_musician.image = image.path;
    n_musician.type = type;
    n_musician.gender = gender;
    n_musician.nationality = nationality;
    n_musician.musicianAlbums = [];

    const artist = await n_musician.save();
    return artist;
  }
  //localhost:3000/musicians/:id/new-album
  async createAlbum(musicianId: number, data: any, image: any) {
    const musician = await this.musicianRepository.findOne({
      where: { id: musicianId },
    });
    const album = new MusicianAlbum();
    album.name = data.name;
    album.image = image.path;
    album.musician = musician;
    const nalbum = await album.save();
    return nalbum;
  }
  //localhost:3000/musicians/:id/update-musician
  async updateMusician(
    id: number,
    name: string,
    info: string,
    gender: GENDER,
    nationality: string,
    type: ArtistType,
    image: any,
  ): Promise<Musician> {
    const musician = await this.findMusicianById(id);
    if (name) {
      musician.name = name;
    }
    if (info) {
      musician.info = info;
    }
    if (gender) {
      musician.gender = gender;
    }
    if (nationality) {
      musician.nationality = nationality;
    }
    if (type) {
      musician.type = type;
    }
    if (image) {
      fs.unlinkSync(musician.image);
      musician.image = image.path;
    }
    const savedSinger = await musician.save();
    return savedSinger;
  }

  //deleteSinger
  async deleteMusician(singerId: number) {
    const musician = await this.findMusicianById(singerId);
    // musician.musicianAlbums.forEach((element) => {
    //   await this.musicAlbumService.deleteMusician(element.id);
    // });
    const result = await musician.remove();
    return result;
  }
}
