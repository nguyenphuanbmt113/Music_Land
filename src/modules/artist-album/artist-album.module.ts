import { Module } from '@nestjs/common';
import { ArtistAlbumController } from './artist-album.controller';
import { ArtistAlbumService } from './artist-album.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SingerAlbum } from 'src/entities/singer-album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SingerAlbum])],
  controllers: [ArtistAlbumController],
  providers: [ArtistAlbumService, SingerAlbum],
  exports: [ArtistAlbumService, SingerAlbum],
})
export class ArtistAlbumModule {}
