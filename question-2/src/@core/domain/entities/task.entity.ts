import Entity from './entity';
import EntityID from '../value-objects/EntityID';
import { GroupType, SessionStatus } from './session.entity';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export interface ITask {
  session: string;
  timeInspect: number;
  status: TaskStatus;
  group: GroupType;
  createdAt: Date;
  updatedAt: Date;
}

export default class Task extends Entity<ITask> {
  public static create(props: ITask, id?: EntityID) {
    return new Task(props, id);
  }

  get session() {
    return this.props.session;
  }

  get timeInspect() {
    return this.props.timeInspect;
  }

  get status() {
    return this.props.status;
  }

  get group() {
    return this.props.group;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
