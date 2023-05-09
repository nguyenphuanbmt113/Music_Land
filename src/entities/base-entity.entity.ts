import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
} from 'typeorm';

@Entity()
class BaseClassEntity extends BaseEntity {
  @CreateDateColumn({ nullable: true })
  createdAt: Date;

  @CreateDateColumn({ nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}

export default BaseClassEntity;
