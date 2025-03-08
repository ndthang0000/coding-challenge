import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export default class LookupTestQuery {
    constructor(public readonly name: string) {}
}

@QueryHandler(LookupTestQuery)
export class LookupTestQueryHandler implements IQueryHandler<LookupTestQuery> {
    constructor() {}

    public async execute(query: LookupTestQuery): Promise<void> {
        console.log('Lookup test query', query);
    }
}
