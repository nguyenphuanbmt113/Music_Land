import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from 'src/entities/favorite.entity';
import { ArtistRepository } from '../artist/artist.repository';
import { StrackModule } from '../strack/strack.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), StrackModule],
  controllers: [FavoriteController],
  providers: [FavoriteService, ArtistRepository],
  exports: [FavoriteService, ArtistRepository],
})
export class FavoriteModule {}
