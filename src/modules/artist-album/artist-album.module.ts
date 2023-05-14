import { Module } from '@nestjs/common';
import { ArtistAlbumController } from './artist-album.controller';
import { ArtistAlbumService } from './artist-album.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingerAlbum } from 'src/entities/singer-album.entity';
import { SongModule } from '../song/song.module';

@Module({
  imports: [TypeOrmModule.forFeature([SingerAlbum]), SongModule],
  controllers: [ArtistAlbumController],
  providers: [ArtistAlbumService],
  exports: [ArtistAlbumService],
})
export class ArtistAlbumModule {}
