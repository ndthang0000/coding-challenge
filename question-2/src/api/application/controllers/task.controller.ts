// src/controllers/session.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { SessionService } from '../services/session.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '@api/presentation/requests/task/create-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly taskService: TaskService,
    @InjectQueue('taskQueue') private readonly taskQueue: Queue,
  ) { }

  @Post()
  async createTask(@Body() dto: CreateTaskDto) {
    const { sessionKey, timeInspect, group } = dto;
    return await this.taskService.addTaskToBullMQ(sessionKey, timeInspect, group);
    // const session = await this.sessionService.findOneSessionByKey(sessionKey);
    // if (!session) {
    //   throw new BadRequestException('Nothing any session is working. Please create a session first');
    // }
    // await this.taskQueue.add('createTask', { sessionKey, timeInspect, group });
    // return { message: 'Task creation queued' };
  }

}