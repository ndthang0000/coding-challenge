// src/services/task.service.ts
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import TaskRepository from 'src/@core/infrastructure/mongoose/repository/task.repository';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { SessionService } from './session.service';
import { GroupType, SessionStatus } from 'src/@core/domain/entities/session.entity';
import Task, { TaskStatus } from 'src/@core/domain/entities/task.entity';
import EntityID from 'src/@core/domain/value-objects/EntityID';
import { TaskDocument } from 'src/@core/infrastructure/mongoose/schemas/task.schema';
import { TaskResponse } from '@api/presentation/response/task.response';

@Injectable()
export class TaskService {
  constructor(
    @Inject() private readonly taskRepo: TaskRepository,
    @Inject(forwardRef(() => SessionService))
    private readonly sessionService: SessionService,
    @InjectQueue('taskQueue') private readonly taskQueue: Queue,
  ) { }

  async addTaskToBullMQ(sessionKey: string, timeInspect: number, group: string) {
    if (sessionKey) {
      const session = await this.sessionService.findOneSessionByKey(sessionKey);
      if (!session) {
        throw new BadRequestException(`Not found session of this Session key [${sessionKey}]`);
      }

      await this.taskQueue.add('createTask', { session, timeInspect, group });
      return { message: 'Task creation queued' };
    }
    else {
      const session = await this.sessionService.findOneByFilter({ group: group });
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
    await this.taskQueue.add('updateStatusTask', { taskId: task.id.value, timeInspect });
    return task;
  }

  async updateTaskStatus(taskId: string, status: TaskStatus) {
    const task = await this.taskRepo.findOneById(EntityID.create({ value: taskId }));
    if (!task) {
      return
    }
    task.updateStatus(status);
    await this.taskRepo.update(task);
    const allTaskOfSession = await this.taskRepo.findTaskByFilter({ session: task.session }, { status: true, _id: true, session: true });
    if (allTaskOfSession.every((t) => t.status === 'DONE')) {
      await this.sessionService.updateSessionStatus(task.session, SessionStatus.DONE);
    }
    return task;
  }

  mappingTaskToResponse(task: Task): TaskResponse {
    return {
      id: task?.id?.value,
      session: task.session,
      timeInspect: task.timeInspect,
      group: task.group,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  convertDocumentToResponse(persist: any): TaskResponse {

    return {
      id: String(persist._id),
      session: persist.session,
      timeInspect: persist.timeInspect,
      group: persist.group,
      status: persist.status,
      createdAt: persist.createdAt,
      updatedAt: persist.updatedAt,
    };
  }
}