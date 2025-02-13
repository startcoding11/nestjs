import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  Index,
} from 'typeorm';
import { IsOptional, IsDateString, Length } from 'class-validator';
import { User } from './user.entity';
import { BaseEntity } from '@/core/entities/mysql/base.entity';

@Entity('worker_profiles')
@Index('idx_employee_id', ['employeeId'])
@Index('idx_hire_date', ['hireDate'])
export class WorkerProfile extends BaseEntity {
  @PrimaryColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({
    name: 'employee_id',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: true,
  })
  @IsOptional()
  @Length(1, 50)
  @Index({ unique: true })
  employeeId?: string;

  @Column({ name: 'hire_date', type: 'date', nullable: true })
  @IsOptional()
  @IsDateString()
  hireDate?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  @IsOptional()
  @Length(1, 100)
  department?: string;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  permissions?: Record<string, any>;

  @OneToOne(() => User, (user) => user.workerProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  get tenureYears(): number | null {
    if (!this.hireDate) return null;
    const today = new Date();
    const hired = new Date(this.hireDate);
    return today.getFullYear() - hired.getFullYear();
  }

  hasPermission(permission: string): boolean {
    if (!this.permissions) return false;
    return this.permissions[permission] === true;
  }
}