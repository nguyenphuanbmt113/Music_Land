import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Track } from './track.entity';

@Entity('playlists')
@Unique(['name'])
export class Playlist extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    default: new Date(),
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.playlists, {
    eager: true,
  })
  user: User;

  // Foreign Key
  @Column()
  userId: number;

  @OneToMany(() => Track, (track) => track.playlist, {
    eager: false,
  })
  tracks: Track[];
}
