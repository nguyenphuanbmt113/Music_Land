import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Musician } from './musician.entity';
import { AbstractAlbum } from 'src/common/class/abstract-album';
import { Music } from './music.entity';
@Entity('musician-albums')
@Unique(['name'])
export class MusicianAlbum extends AbstractAlbum {
  @ManyToOne(() => Musician, (musician) => musician.musicianAlbums, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  musician: Musician;

  //Foreign Key
  @Column()
  musicianId: number;

  @OneToMany(() => Music, (music) => music.musicianAlbum, {
    eager: false,
  })
  musics: Music[];
}
