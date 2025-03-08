import Entity from './entity';
import EntityID from '../value-objects/EntityID';

export enum SessionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum GroupType {
  DEFAULT = 'DEFAULT',
  RANDOM = 'RANDOM',
}

export interface ISession {
  sessionKey: string;
  timeInspect: number;
  status: SessionStatus;
  group: GroupType;
  tasks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default class Session extends Entity<ISession> {
  public static create(props: ISession, id?: EntityID) {
    return new Session(props, id);
  }

  get sessionKey() {
    return this.props.sessionKey;
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

  get tasks() {
    return this.props.tasks;
  }
}
