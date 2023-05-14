import { Module } from '@nestjs/common';
import { StrackController } from './strack.controller';
import { StrackService } from './strack.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from 'src/entities/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  controllers: [StrackController],
  providers: [StrackService],
  exports: [StrackService],
})
export class StrackModule {}
