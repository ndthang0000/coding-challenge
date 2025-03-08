import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Test from 'src/@core/domain/entities/Test';
import TestRepository from 'src/@core/infrastructure/mongoose/repository/test';

export default class CreateTestCommand {
    constructor(
        public readonly name,
        public readonly description,
    ) {}
}

@CommandHandler(CreateTestCommand)
export class CreateTestCommandHandler implements ICommandHandler<CreateTestCommand> {
    constructor(private readonly testRepo: TestRepository) {}

    public async execute(command: CreateTestCommand): Promise<void> {
        console.log('Create test command', command);

        await this.testRepo.add(
            Test.create({
                data: command.name,
            }),
        );
    }
}
