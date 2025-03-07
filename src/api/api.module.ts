import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { ModulesModule } from './modules/modules.module';
import { V1Module } from './v1/v1.module';

@Module({
  imports: [CoreModule, ModulesModule, V1Module],
})
export class ApiModule {}
