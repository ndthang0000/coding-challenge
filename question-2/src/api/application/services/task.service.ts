// src/services/task.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionService } from './session.service';
import { Task } from 'src/@core/infrastructure/mongoose/schemas/task.schema';

@Injectable()
export class TaskService {

}