import { AbstractMusic } from 'src/common/class/abstract-music';
import { SongLanguage } from 'src/common/enum/song-lang';
import { SongType } from 'src/common/enum/song-type';
import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { SingerAlbum } from './singer-album.entity';
import { Track } from './track.entity';

@Entity('songs')
@Unique(['name', 'source'])
export class Song extends AbstractMusic {
  @Column({
    type: 'enum',
    enum: SongType,
    array: false,
  })
  type: SongType;

  @Column({
    type: 'enum',
    enum: SongLanguage,
    array: false,
  })
  language: SongLanguage;

  @ManyToOne(() => SingerAlbum, (singerAlbum) => singerAlbum.songs, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  singerAlbum: SingerAlbum;

  // Foreign Key
  @Column()
  singerAlbumId: number;

  @OneToMany(() => Track, (track) => track.playlist, {
    eager: false,
  })
  tracks: Track[];
}
