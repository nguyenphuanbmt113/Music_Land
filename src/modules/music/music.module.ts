import { Module } from '@nestjs/common';
import { MusicController } from './music.controller';
import { MusicService } from './music.service';
import { Music } from 'src/entities/music.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistModule } from '../playlist/playlist.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { StrackModule } from '../strack/strack.module';
import { MusicRepository } from './music.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Music]),
    PlaylistModule,
    FavoriteModule,
    StrackModule,
  ],
  controllers: [MusicController],
  providers: [MusicService, MusicRepository],
  exports: [MusicService, MusicRepository],
})
export class MusicModule {}
