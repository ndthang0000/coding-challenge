import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandler } from './application/commands';
import { QueryHandler } from './application/queries';
import { ApplicationServices } from './application/services';
import { CoreModule } from 'src/@core/core.module';
import { SessionController } from './application/controllers/session.controller';

@Module({
    imports: [CqrsModule, CoreModule],

  controllers: [SessionController],
    providers: [...ApplicationServices, ...CommandHandler, ...QueryHandler],
    exports: [ApiModule],
})
export class ApiModule {}
