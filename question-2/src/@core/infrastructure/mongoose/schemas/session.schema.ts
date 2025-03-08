import { HydratedDocument, model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GroupType, SessionStatus } from 'src/@core/domain/entities/session.entity';

export type SessionDocument = HydratedDocument<ISessionModel>;

export interface ISessionModel {
  sessionKey: string;
  timeInspect: number;
  status: SessionStatus;
  tasks: string[]
  group: GroupType;
  createdAt: Date;
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class Session implements ISessionModel {
  @Prop({ required: true, index: true })
  sessionKey: string;

  @Prop({ required: true })
  timeInspect: number;

  @Prop({ enum: SessionStatus, default: SessionStatus.PENDING })
  status: SessionStatus;

  @Prop({ enum: GroupType, default: GroupType.DEFAULT })
  group: GroupType;

  @Prop({ type: [Types.ObjectId], ref: 'Task', default: [] })
  tasks: string[];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

export const SessionModel = model<Session>('Session', SessionSchema);



