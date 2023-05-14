import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { Singer } from 'src/entities/singer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistRepository } from './artist.repository';
import { ArtistAlbumModule } from '../artist-album/artist-album.module';

@Module({
  imports: [TypeOrmModule.forFeature([Singer]), ArtistAlbumModule],
  controllers: [ArtistController],
  providers: [ArtistService, ArtistRepository],
  exports: [ArtistService, ArtistRepository],
})
export class ArtistModule {}
