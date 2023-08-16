import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

export default class BaseModel {
  @PrimaryColumn({ type: 'varchar' })
  @Generated('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'varchar', nullable: false, default: 'unknown' })
  createdBy: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'varchar', nullable: true })
  updatedBy: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt!: Date;

  @Column({ type: 'varchar', nullable: true })
  deletedBy: string;
}
