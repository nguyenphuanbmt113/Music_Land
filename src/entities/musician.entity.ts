import { AbstractArtist } from 'src/common/class/abstract-artist';
import { Entity, OneToMany } from 'typeorm';
import { MusicianAlbum } from './musician-album.entity';

@Entity('musicians')
export class Musician extends AbstractArtist {
  @OneToMany(() => MusicianAlbum, (musicianAlbum) => musicianAlbum.musician, {
    eager: false,
  })
  musicianAlbums: MusicianAlbum[];
}
