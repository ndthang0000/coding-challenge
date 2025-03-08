// src/services/task.service.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import TaskRepository from 'src/@core/infrastructure/mongoose/repository/task.repository';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { SessionService } from './session.service';
import { GroupType, SessionStatus } from 'src/@core/domain/entities/session.entity';
import Task, { TaskStatus } from 'src/@core/domain/entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @Inject() private readonly taskRepo: TaskRepository,
    @Inject() private readonly sessionService: SessionService,
    @InjectQueue('taskQueue') private readonly taskQueue: Queue,
  ) { }

  async addTaskToBullMQ(sessionKey: string, timeInspect: number, group: string) {
    if (sessionKey) {
      const session = await this.sessionService.findOneSessionByKey(sessionKey);
      if (!session) {
        throw new BadRequestException(`Not found session of this Session key [${sessionKey}]`);
      }
      if (session.status == SessionStatus.DONE) {
        throw new BadRequestException('The queue is done. Please create a new session first');
      }
      await this.taskQueue.add('createTask', { session, timeInspect, group });
      return { message: 'Task creation queued 1' };
    }
    else {
      const session = await this.sessionService.findOneByFilter({ status: SessionStatus.IN_PROGRESS, group: group });
      if (!session) {
        throw new BadRequestException('Nothing any session is working. Please create a session first');
      }
      await this.taskQueue.add('createTask', { session: session, timeInspect, group });
    }

  }

  async createTask(session: any, timeInspect: number, group: GroupType) {
    const taskEntity = Task.create({
      session: session.id,
      timeInspect,
      group,
      status: TaskStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const task = await this.taskRepo.add(taskEntity);
    await this.sessionService.addTaskToSession(session, task.id.value);
  }
}