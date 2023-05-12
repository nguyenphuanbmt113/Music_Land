import { Module } from '@nestjs/common';
import { ArtistAlbumController } from './artist-album.controller';
import { ArtistAlbumService } from './artist-album.service';

@Module({
  controllers: [ArtistAlbumController],
  providers: [ArtistAlbumService],
})
export class ArtistAlbumModule {}
