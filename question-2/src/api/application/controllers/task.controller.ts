// src/controllers/session.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { TaskService } from '../services/task.service';
import { CreateTaskDto } from '@api/presentation/requests/task/create-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    @InjectQueue('taskQueue') private readonly taskQueue: Queue,
  ) { }

  @Post()
  async createTask(@Body() dto: CreateTaskDto) {
    const { sessionKey, timeInspect, group } = dto;
    return await this.taskService.addTaskToBullMQ(sessionKey, timeInspect, group);
  }

}