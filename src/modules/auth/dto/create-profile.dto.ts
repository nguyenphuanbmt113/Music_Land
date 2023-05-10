import { IsOptional } from 'class-validator';
import { GENDER } from 'src/common/enum/gender.enum';

export class CreateProfileDto {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  age: number;

  @IsOptional()
  phone: string;

  @IsOptional()
  gender: GENDER;

  @IsOptional()
  country: string;

  @IsOptional()
  city: string;

  @IsOptional()
  address: string;
}
