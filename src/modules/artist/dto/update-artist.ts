import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {}
