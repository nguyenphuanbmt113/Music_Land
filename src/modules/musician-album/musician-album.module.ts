import { Module } from '@nestjs/common';
import { MusicianAlbumController } from './musician-album.controller';
import { MusicianAlbumService } from './musician-album.service';

@Module({
  controllers: [MusicianAlbumController],
  providers: [MusicianAlbumService],
  exports: [MusicianAlbumService],
})
export class MusicianAlbumModule {}
