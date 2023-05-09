import {
  BaseEntity,
  Column,
  Entity,
  Generated,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Playlist } from './playlist.entity';
import { Favorite } from './favorite.entity';
import { Song } from './song.entity';
import { Music } from './music.entity';

@Entity('tracks')
export class Track extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  link: string;

  @Generated()
  @Column()
  index: number;

  @ManyToOne(() => Playlist, (playlist) => playlist.tracks, {
    eager: true,
  })
  playlist: Playlist;

  @ManyToOne(() => Favorite, (favorite) => favorite.tracks, {
    eager: true,
  })
  favorite: Favorite;

  @ManyToOne(() => Song, (song) => song.tracks, {
    eager: true,
  })
  song: Song;

  @ManyToOne(() => Music, (music) => music.tracks, {
    eager: true,
  })
  music: Music;

  @Column({
    nullable: true,
  })
  playlistId: number;

  @Column({
    nullable: true,
  })
  favoriteId: number;

  @Column({
    nullable: true,
  })
  songId: number;

  @Column({
    nullable: true,
  })
  musicId: number;
}
