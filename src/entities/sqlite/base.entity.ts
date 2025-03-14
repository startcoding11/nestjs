import {
	CreateDateColumn,
	// PrimaryGeneratedColumn, // cannot generate random values — it strictly increments
	UpdateDateColumn,
	DeleteDateColumn,
	BaseEntity as TypeOrmBaseEntity,
	PrimaryColumn,
} from 'typeorm';

export abstract class BaseEntity extends TypeOrmBaseEntity {
	// @PrimaryGeneratedColumn('rowid') // 'rowid' - oprimised for sqlite
	// id: number;

	@PrimaryColumn()
	id: string = Math.random().toString(36).substr(2, 6);

	@CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	updatedAt: Date;

	@DeleteDateColumn({ type: 'timestamp', nullable: true })
	deletedAt?: Date;

}
