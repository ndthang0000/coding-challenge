import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TestController } from './application/controllers/test.controller';
import { CommandHandler } from './application/commands';
import { QueryHandler } from './application/queries';
import { ApplicationServices } from './application/services';
import { CoreModule } from 'src/@core/core.module';

@Module({
    imports: [CqrsModule, CoreModule],
    controllers: [TestController],
    providers: [...ApplicationServices, ...CommandHandler, ...QueryHandler],
    exports: [ApiModule],
})
export class ApiModule {}
