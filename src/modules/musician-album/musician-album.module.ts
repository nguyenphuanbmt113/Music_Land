import { Module } from '@nestjs/common';
import { MusicianAlbumController } from './musician-album.controller';
import { MusicianAlbumService } from './musician-album.service';
import { MusicianAlbum } from 'src/entities/musician-album.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusicModule } from '../music/music.module';

@Module({
  imports: [TypeOrmModule.forFeature([MusicianAlbum]), MusicModule],
  controllers: [MusicianAlbumController],
  providers: [MusicianAlbumService],
  exports: [MusicianAlbumService],
})
export class MusicianAlbumModule {}
