import { OnQueueEvent, Process, Processor } from '@nestjs/bull';

import { Job } from 'bull';
import { SessionService } from './session.service';
import { Logger } from '@nestjs/common';

@Processor('sessionQueue')
export class SessionProcessor {
  constructor(private readonly sessionService: SessionService) { }

  private readonly logger = new Logger(SessionProcessor.name);

  @Process('createSession')
  async handleCreateSession(job: Job) {
    const { sessionKey, timeInspect, group } = job.data;
    await this.sessionService.createSession(sessionKey, timeInspect, group);
  }

  @OnQueueEvent('completed')
  async onCompleted(job: Job) {
    this.logger.log(`[${job.name}] >>> Job id = ${job.id} completed `,);
  }
}

