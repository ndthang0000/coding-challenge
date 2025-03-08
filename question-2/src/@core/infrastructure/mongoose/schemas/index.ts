import { SessionSchema, Session } from './session.schema';
import { TaskSchema, Task } from './task.schema';

export const NameAndSchema = [
  { name: Task.name, schema: TaskSchema, },
  { name: Session.name, schema: SessionSchema, },
];
