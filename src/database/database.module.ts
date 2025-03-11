import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfService } from '../conf/conf.service';
import { Admin } from '@/api/core/admin/entities/admin.entity';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: async (confService: ConfService) => {
				const { type, ...postgres } = confService.env().postgres;
				return {
					type: 'postgres',
					...postgres,
					entities: [Admin, 'dist/src/entities/*.entity.{ts,js}'],
				}
			},
			inject: [ConfService],
		}),
		TypeOrmModule.forFeature([]),
	],
	providers: [ConfService],
	exports: [TypeOrmModule],
})
export class DatabaseModule { }
