import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SongLanguage } from 'src/common/enum/song-lang';
import { SongType } from 'src/common/enum/song-type';
import { SingerAlbum } from 'src/entities/singer-album.entity';
import { Song } from 'src/entities/song.entity';
import { Repository } from 'typeorm';
import { SongService } from '../song/song.service';

@Injectable()
export class ArtistAlbumService {
  constructor(
    @InjectRepository(SingerAlbum)
    private singerAlbumRepository: Repository<SingerAlbum>,
    private songService: SongService,
  ) {}

  //localhost:3000/singer-albums
  async findAll() {
    return await this.singerAlbumRepository.find();
  }
  //localhost:3000/singer-albums/:id
  async getSignerAlbumById(id: number) {
    const singerAlbum = await this.singerAlbumRepository.findOne({
      where: { id },
    });
    if (!singerAlbum) {
      throw new NotFoundException('Singer Album not found');
    }
    return singerAlbum;
  }

  async createNewSong(
    singerAlbumId: number,
    name: string,
    description: string,
    artist: string,
    type: SongType,
    language: SongLanguage,
    source: any,
  ): Promise<Song> {
    console.log('source:', source);
    const song = new Song();
    const singerAlbum = await this.getSignerAlbumById(singerAlbumId);
    song.name = name;
    song.description = description;
    song.artist = artist;
    song.type = type;
    song.language = language;
    song.tempImage = singerAlbum.image;
    song.source = source;
    song.singerAlbum = singerAlbum;
    const savedSong = await song.save();
    return savedSong;
  }
  //localhost:3000/singer-albums/:id/update-album
  async updateSingerAlbum(
    id: number,
    createAlbumDto: any,
  ): Promise<SingerAlbum> {
    const singerAlbum = await this.getSignerAlbumById(id);
    const { name } = createAlbumDto;
    if (name) {
      singerAlbum.name = name;
    }
    const savedSingerAlbum = await singerAlbum.save();
    return savedSingerAlbum;
  }
  //localhost:3000/singer-albums/:id/delete-album
  async deleteSingerAlbum(albumId: number) {
    const album = await this.getSignerAlbumById(albumId);
    const d = await album.remove();
    return d;
  }
  //localhost:3000/singer-albums/:id/clear-album
  async clearSingerAlbum(id: number): Promise<SingerAlbum> {
    const singerAlbum = await this.getSignerAlbumById(id);
    for (let i = 0; i < singerAlbum.songs.length; i++) {
      await this.songService.deleteSong(singerAlbum.songs[i].id);
    }
    singerAlbum.songs = [];
    return await singerAlbum.save();
  }
}
