import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicType } from 'src/common/enum/music-type';
import { Music } from 'src/entities/music.entity';
import { MusicianAlbum } from 'src/entities/musician-album.entity';
import { DeleteResult, Repository } from 'typeorm';
import { MusicService } from '../music/music.service';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class MusicianAlbumService {
  constructor(
    @InjectRepository(MusicianAlbum)
    private musicianAlbumRepository: Repository<MusicianAlbum>,
    // private awsService: AwsService,
    private musicService: MusicService,
  ) {}

  async getAllMusicianAlbums(): Promise<MusicianAlbum[]> {
    return await this.musicianAlbumRepository.find();
  }

  async getMusicianAlbumById(id: number): Promise<MusicianAlbum> {
    const musicianAlbum = await this.musicianAlbumRepository.findOne({
      where: {
        id,
      },
    });
    if (!musicianAlbum) {
      throw new NotFoundException(
        `Musician Album Album with id ${id} does not found`,
      );
    }
    return musicianAlbum;
  }

  async createNewMusic(
    musicianAlbumId: number,
    name: string,
    description: string,
    artist: string,
    type: MusicType,
    source: any,
  ): Promise<Music> {
    const music = new Music();
    const musicianAlbum = await this.getMusicianAlbumById(musicianAlbumId);
    music.name = name;
    music.description = description;
    music.artist = artist;
    music.type = type;
    music.tempImage = musicianAlbum.image;
    music.source = source.path;
    music.musicianAlbum = musicianAlbum;
    const savedMusic = await music.save();
    return savedMusic;
  }

  async updateMusicianAlbum(
    id: number,
    createAlbumDto: UpdateAlbumDto,
  ): Promise<MusicianAlbum> {
    const musicianAlbum = await this.getMusicianAlbumById(id);
    const { name } = createAlbumDto;
    if (name) {
      musicianAlbum.name = name;
    }
    const savedMusicianAlbum = await musicianAlbum.save();
    return savedMusicianAlbum;
  }

  async deleteMusicianAlbum(id: number): Promise<DeleteResult> {
    const musicianAlbum = await this.getMusicianAlbumById(id);
    for (let i = 0; i < musicianAlbum.musics.length; i++) {
      await this.musicService.deleteMusic(musicianAlbum.musics[i].id);
    }
    const result = await this.musicianAlbumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Musician Album with id ${id} does not found`,
      );
    }
    return result;
  }
  async clearMusicianAlbum(id: number) {
    const musicianAlbum = await this.getMusicianAlbumById(id);
    for (let i = 0; i < musicianAlbum.musics.length; i++) {
      await this.musicService.deleteMusic(musicianAlbum.musics[i].id);
    }
    musicianAlbum.musics = [];
    await musicianAlbum.save();
    return 'clear okela';
  }
}
