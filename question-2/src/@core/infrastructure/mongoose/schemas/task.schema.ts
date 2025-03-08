import { HydratedDocument, model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GroupType } from 'src/@core/domain/entities/session.entity';
import { TaskStatus } from 'src/@core/domain/entities/task.entity';

export type TaskDocument = HydratedDocument<ITaskModel>;

export interface ITaskModel {
  session: string;
  timeInspect: number;
  status: TaskStatus;
  group: GroupType;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class Task implements ITaskModel {

  @Prop({ type: Types.ObjectId, ref: 'Session' })
  session: string;

  @Prop({ required: true })
  timeInspect: number;

  @Prop({ enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Prop({ enum: GroupType, default: GroupType.DEFAULT })
  group: GroupType;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

}

export const TaskSchema = SchemaFactory.createForClass(Task);

export const TaskModel = model<Task>('Task', TaskSchema);