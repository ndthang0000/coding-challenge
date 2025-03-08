import { Process, Processor, OnQueueEvent } from '@nestjs/bull';
import { Job } from 'bull';
import { TaskService } from './task.service';
import { sleep } from 'src/@core/infrastructure/utils/sleep';
import { TaskStatus } from 'src/@core/domain/entities/task.entity';
import { Logger, Injectable } from '@nestjs/common';

@Injectable()
@Processor('taskQueue')
export class TaskProcessor {
  constructor(private readonly taskService: TaskService) { }

  private readonly logger = new Logger(TaskProcessor.name);

  @Process('createTask')
  async handleCreateTask(job: Job) {
    const { session, timeInspect, group } = job.data;
    return await this.taskService.createTask(session, timeInspect, group);
  }

  @Process('updateStatusTask')
  async handleUpdateStatusTask(job: Job) {
    const { taskId, timeInspect } = job.data;
    this.logger.log(`[${job.name}] >>> Job id = ${job.id} is handling ... `,);
    await sleep(timeInspect); // sleep ms and update status done for task
    await this.taskService.updateTaskStatus(taskId, TaskStatus.DONE);
  }

  @OnQueueEvent('completed')
  async onCompleted(job: Job) {
    this.logger.log(`[${job.name}] >>> Job id = ${job.id} completed `,);
  }

}