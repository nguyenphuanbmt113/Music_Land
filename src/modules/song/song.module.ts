import { Module } from '@nestjs/common';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { Song } from 'src/entities/song.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongRepository } from './song.repository';
import { PlaylistModule } from '../playlist/playlist.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { StrackModule } from '../strack/strack.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song]),
    PlaylistModule,
    FavoriteModule,
    StrackModule,
  ],
  controllers: [SongController],
  providers: [SongService, SongRepository],
  exports: [SongService, SongRepository],
})
export class SongModule {}
