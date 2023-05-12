import { Module } from '@nestjs/common';
import { MusicianController } from './musician.controller';
import { MusicianService } from './musician.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Musician } from 'src/entities/musician.entity';
import { MusicianRepository } from './musician.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Musician])],
  controllers: [MusicianController],
  providers: [MusicianService, MusicianRepository],
})
export class MusicianModule {}
