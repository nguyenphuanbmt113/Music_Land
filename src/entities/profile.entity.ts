import { GENDER } from 'src/common/enum/gender.enum';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Favorite } from './favorite.entity';
import { User } from './user.entity';

@Entity('profiles')
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @Column({
    nullable: true,
  })
  gender: GENDER;

  @Column({
    nullable: true,
  })
  age: number;

  @Column({
    nullable: true,
  })
  country: string;

  @Column({
    nullable: true,
  })
  city: string;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    nullable: true,
  })
  image: string;

  @OneToOne(() => User, (user) => user.profile, {
    eager: true,
  })
  user: User;

  @OneToOne(() => Favorite, (favorite) => favorite.profile)
  @JoinColumn()
  favorite: Favorite;
}
