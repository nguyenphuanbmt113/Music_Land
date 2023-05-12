import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SongLanguage } from 'src/common/enum/song-lang';
import { SongType } from 'src/common/enum/song-type';
import { SingerAlbum } from 'src/entities/singer-album.entity';
import { Song } from 'src/entities/song.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistAlbumService {
  constructor(
    @InjectRepository(SingerAlbum)
    private singerAlbumRepository: Repository<SingerAlbum>,
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
  //localhost:3000/singer-albums/:id/new-song
  // async addSongtoAlbum(albumId: number, song: Song) {
  //   const album = await this.getSignerAlbumById(albumId);
  //   if (!album) {
  //     throw new NotFoundException('Singer Album not found');
  //   }
  //   album.songs = [song];
  //   const n_album = await album.save();
  //   return n_album;
  // }
  async createNewSong(
    singerAlbumId: number,
    name: string,
    description: string,
    artist: string,
    type: SongType,
    language: SongLanguage,
    // source: any,
  ): Promise<Song> {
    const song = new Song();
    const singerAlbum = await this.getSignerAlbumById(singerAlbumId);
    song.name = name;
    song.description = description;
    song.artist = artist;
    song.type = type;
    song.language = language;
    song.tempImage = singerAlbum.image;
    // song.source = await this.awsService.fileUpload(source, 'songs');
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
  //localhost:3000/singer-albums/:id/clear-album
  // async clearSingerAlbum(id: number): Promise<SingerAlbum> {
  //   const singerAlbum = await this.getSignerAlbumById(id);
  //   for (let i = 0; i < singerAlbum.songs.length; i++) {
  //     await this.songService.deleteSong(singerAlbum.songs[i].id);
  //   }
  //   singerAlbum.songs = [];
  //   return await singerAlbum.save();
  // }
}
