import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { TaskService } from './task.service';

@Processor('taskQueue')
export class TaskProcessor {
  constructor(private readonly taskService: TaskService) { }

  @Process('createTask')
  async handleCreateTask(job: Job) {
    const { sessionKey, timeInspect, group } = job.data;
    // await this.taskService.createTask(sessionKey, timeInspect, group);
  }

  @Process('updateTaskStatus')
  async handleUpdateTaskStatus(job: Job) {
    const { taskId, status } = job.data;
    // await this.taskService.updateTaskStatus(taskId, status);
  }
}