import {
  BaseEntity,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Track } from './track.entity';

@Entity('favorite-lists')
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Profile, (profile) => profile.favorite)
  profile: Profile;

  @OneToMany(() => Track, (track) => track.favorite, {
    eager: false,
  })
  tracks: Track[];
}
