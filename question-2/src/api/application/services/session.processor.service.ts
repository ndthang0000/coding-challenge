import { Process, Processor } from '@nestjs/bull';

import { Job } from 'bull';
import { SessionService } from './session.service';

@Processor('sessionQueue')
export class SessionProcessor {
  constructor(private readonly sessionService: SessionService) { }

  @Process('createSession')
  async handleCreateSession(job: Job) {
    const { sessionKey, timeInspect, group } = job.data;
    await this.sessionService.createSession(sessionKey, timeInspect, group);
  }
}

