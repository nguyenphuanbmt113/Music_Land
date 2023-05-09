import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ArtistType } from '../enum/artist.enum';
import { GENDER } from '../enum/gender.enum';
export abstract class AbstractArtist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  info: string;

  @Column()
  image: string;

  @Column({
    type: 'enum',
    enum: ArtistType,
    array: false,
  })
  type: ArtistType;

  @Column({
    nullable: true,
  })
  gender: GENDER;

  @Column()
  nationality: string;
}
