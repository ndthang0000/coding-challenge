import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
    constructor() {}

    public async test(): Promise<void> {
        console.log('test service');
    }
}
