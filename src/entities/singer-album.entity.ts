import { AbstractAlbum } from 'src/common/class/abstract-album';
import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { Singer } from './singer.entity';
import { Song } from './song.entity';

@Entity('singer-albums')
@Unique(['name'])
export class SingerAlbum extends AbstractAlbum {
  @ManyToOne(() => Singer, (singer) => singer.singerAlbums, {
    eager: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  singer: Singer;

  //Foreign Key
  @Column()
  singerId: number;

  @OneToMany(() => Song, (song) => song.singerAlbum, {
    eager: false,
  })
  songs: Song[];
}
