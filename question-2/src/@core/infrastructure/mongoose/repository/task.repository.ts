import { Injectable } from '@nestjs/common';
import Task from 'src/@core/domain/entities/task.entity';
import Repository from './repository';
import { Model } from 'mongoose';
import EntityID from 'src/@core/domain/value-objects/EntityID';
import { InjectModel } from '@nestjs/mongoose';
import { TaskModel, TaskDocument, ITaskModel } from '../schemas/task.schema';
import ITaskRepository from 'src/@core/domain/repositories/i.task.repository';

@Injectable()
export default class TaskRepository extends Repository<Task, ITaskModel> implements ITaskRepository {
  public constructor(@InjectModel(Task.name) sessionModel: Model<ITaskModel>) {
    super(sessionModel);
  }


  async findTaskByFilter(filter: any, selected: any): Promise<Task[] | null> {
    const doc = await this._model.find(filter, selected).exec();
    return doc.map((d) => this.convertDocumentToEntity(d));
  }

  protected convertDocumentToEntity(persist: TaskDocument): Task {
    const { _id, ...props } = persist.toObject();

    const entity = Task.create(
      {
        session: props.session,
        timeInspect: props.timeInspect,
        status: props.status,
        group: props.group,
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      },

      EntityID.create({ value: _id.toString() }),
    );

    return entity;
  }

  protected convertEntityToDocument(entity: Task): TaskDocument {
    const document = {
      _id: entity.id?.value,
      session: entity.session,
      timeInspect: entity.timeInspect,
      status: entity.status,
      group: entity.group,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };

    const persist = new TaskModel(document);

    return persist;
  }
}
