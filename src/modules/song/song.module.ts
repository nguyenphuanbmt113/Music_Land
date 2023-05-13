import { Module } from '@nestjs/common';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { Song } from 'src/entities/song.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongRepository } from './song.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  controllers: [SongController],
  providers: [SongService, SongRepository],
  exports: [SongService, SongRepository],
})
export class SongModule {}
