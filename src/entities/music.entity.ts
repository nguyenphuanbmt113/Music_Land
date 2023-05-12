import { AbstractMusic } from 'src/common/class/abstract-music';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { MusicianAlbum } from './musician-album.entity';
import { MusicType } from 'src/common/enum/music-type';
import { Track } from './track.entity';

@Entity('musics')
export class Music extends AbstractMusic {
  @Column({
    type: 'enum',
    enum: MusicType,
    array: false,
  })
  type: MusicType;

  @ManyToOne(() => MusicianAlbum, (musicianAlbum) => musicianAlbum.musics, {
    eager: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  musicianAlbum: MusicianAlbum;

  // Foreign Key
  @Column()
  musicianAlbumId: number;

  @OneToMany(() => Track, (track) => track.playlist, {
    eager: false,
  })
  tracks: Track[];
}
