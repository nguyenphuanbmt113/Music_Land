import { ArtistType } from 'src/common/enum/artist.enum';
import { GENDER } from 'src/common/enum/gender.enum';

export class CreateArtistDto {
  name: string;
  image: any;
  info: string;
  type: ArtistType;
  gender: GENDER;
  nationality: string;
}
