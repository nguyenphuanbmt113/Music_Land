import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistRepository } from './artist.repository';
import { ArtistType } from 'src/common/enum/artist.enum';
import { GENDER } from 'src/common/enum/gender.enum';
import { Singer } from 'src/entities/singer.entity';
import { SingerAlbum } from 'src/entities/singer-album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateArtistDto } from './dto/update-artist';
import { CreateArtistDto } from './dto/create-artist';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistRepository)
    private artistRepository: ArtistRepository,
  ) {}

  //localhost:3000/singers
  async findAll() {
    return await this.artistRepository.find();
  }

  //localhost:3000/singers/limited
  async getLimitSingers(limit: number) {
    const singers = await this.artistRepository.getLimitedSinger(limit);
    return singers;
  }
  //localhost:3000/singers/filtered
  async getFilterSingers(
    limit: number,
    nationality: string,
    type: ArtistType,
    gender: GENDER,
  ) {
    const singers = await this.artistRepository.filterSinger(
      limit,
      nationality,
      type,
      gender,
    );
    return singers;
  }

  //localhost: 3000/singers/:id
  async findSingerById(id: number) {
    return await this.artistRepository.findOne({
      where: { id },
    });
  }
  //localhost:3000/singers/new-singer
  async createSinger(data: CreateArtistDto) {
    const n_artist = new Singer();
    n_artist.name = data.name;
    n_artist.info = data.info;
    n_artist.image = data.image;
    n_artist.type = data.type;
    n_artist.gender = data.gender;
    n_artist.nationality = data.nationality;
    n_artist.singerAlbums = [];

    const artist = await n_artist.save();
    return artist;
  }
  //localhost:3000/singers/:id/new-album
  async createAlbum(singerId: number, data: CreateAlbumDto) {
    const singer = await this.artistRepository.findOne({
      where: { id: singerId },
    });
    const album = new SingerAlbum();
    album.name = data.name;
    album.image = data.image;
    album.singer = singer;
    const nalbum = await album.save();
    return nalbum;
  }
  //localhost:3000/singers/:id/update-singer
  async updateSinger(id: number, data: UpdateArtistDto): Promise<Singer> {
    const singer = await this.findSingerById(id);
    if (data.name) {
      singer.name = data.name;
    }
    if (data.info) {
      singer.info = data.info;
    }
    if (data.gender) {
      singer.gender = data.gender;
    }
    if (data.nationality) {
      singer.nationality = data.nationality;
    }
    if (data.type) {
      singer.type = data.type;
    }
    if (data.image) {
      // await this.awsService.fileDelete(singer.image);
      // singer.image = await this.awsService.fileUpload(image, 'singer-images');
      singer.image = data.image;
    }
    const savedSinger = await singer.save();
    return savedSinger;
  }

  //deleteSinger
  async deleteSinger(singerId: number) {
    const singer = await this.findSingerById(singerId);
    const result = await singer.remove();
    // if (result.affected === 0) {
    //   throw new NotFoundException(`Singer with id ${singerId} does not found`);
    // }
    return result;
    // return 'delete okela';
  }
}
