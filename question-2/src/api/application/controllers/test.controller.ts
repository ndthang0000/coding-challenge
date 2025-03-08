import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateTestDto } from '../../presentation/dtos/requests/test/create.dto';
import { LookupTestDto } from '../../presentation/dtos/requests/test/lookup.dto';
import { TestService } from 'src/api/application/services/test.service';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import LookupTestQuery from 'src/api/application/queries/lookup-test.query';
import CreateTestCommand from 'src/api/application/commands/create-test.command';

@Controller('/test')
export class TestController {
    constructor(
        private readonly testAppServices: TestService,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    @Post()
    create(@Body() createTestDto: CreateTestDto): string {
        console.log('Create test controller', createTestDto);
        this.commandBus.execute(new CreateTestCommand(createTestDto.name, createTestDto.description));
        return 'Create test ' + createTestDto.name;
    }

    @Get()
    lookup(@Query() lookupTestDto: LookupTestDto): string {
        console.log('Lookup test controller', lookupTestDto);
        this.queryBus.execute(new LookupTestQuery(lookupTestDto.name));
        return 'Lookup test ' + lookupTestDto.name;
    }

    @Get('ok')
    test(): string {
        this.testAppServices.test();
        return 'Test';
    }
}
