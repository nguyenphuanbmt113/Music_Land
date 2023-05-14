import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from './playlist.service';
import { Playlist } from 'src/entities/playlist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrackModule } from '../strack/strack.module';
import { PlaylistRepository } from './playlist.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist]), StrackModule],
  controllers: [PlaylistController],
  providers: [PlaylistService, PlaylistRepository],
  exports: [PlaylistService, PlaylistRepository],
})
export class PlaylistModule {}
