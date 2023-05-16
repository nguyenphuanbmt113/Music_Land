import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from 'src/entities/track.entity';
import { Repository } from 'typeorm';

@Controller('strack')
export class StrackController {
  constructor(
    @InjectRepository(Track) private trackRepository: Repository<Track>,
  ) {}

  @Get()
  async getTracks() {
    return await this.trackRepository.find();
  }
}
