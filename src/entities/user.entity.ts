import * as bcryptjs from 'bcryptjs';
import { Role } from 'src/common/enum/role.enum';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Playlist } from './playlist.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    enumName: 'roles',
    default: Role.USER,
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
    const comparePass = await bcryptjs.compare(this.password, hashPassword);
    return comparePass;
  }

  //? relation
  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @Column()
  profileId: string;

  @OneToMany(() => Playlist, (playlist) => playlist.user, {
    eager: false,
  })
  playlists: Playlist[];
}
