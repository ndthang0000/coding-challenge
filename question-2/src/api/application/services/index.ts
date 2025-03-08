import { SessionProcessor } from './session.processor.service';
import { SessionService } from './session.service';
import { TaskProcessor } from './task.processor.service';
import { TaskService } from './task.service';

export const ApplicationServices = [
  SessionService,
  TaskService,
  SessionProcessor,
  TaskProcessor
];
