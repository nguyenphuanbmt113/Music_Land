import * as bcryptjs from 'bcryptjs';
import { Role } from 'src/common/enum/role.enum';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Playlist } from './playlist.entity';
import { Profile } from './profile.entity';
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  refresh_token: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
  })
  roles: Role[];

  @Column({
    default: false,
  })
  isEmailVerified: boolean;

  @Column({
    nullable: true,
  })
  googleId: string;

  @Column({
    nullable: true,
  })
  facebookId: string;

  @BeforeInsert()
  hashPass() {
    this.password = bcryptjs.hashSync(this.password, 10);
  }

  async validatePassword(hashPassword: string) {
    const comparePass = await bcryptjs.compareSync(hashPassword, this.password); //password hash
    return comparePass;
  }

  //? relation
  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @Column({ nullable: true })
  profileId: number;

  @OneToMany(() => Playlist, (playlist) => playlist.user, {
    eager: false,
  })
  playlists: Playlist[];
}
