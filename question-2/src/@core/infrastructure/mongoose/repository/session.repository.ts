import { Injectable } from '@nestjs/common';
import Session from 'src/@core/domain/entities/session.entity';
import Repository from './repository';
import { Model } from 'mongoose';
import EntityID from 'src/@core/domain/value-objects/EntityID';
import { InjectModel } from '@nestjs/mongoose';
import { ISessionModel, SessionDocument, SessionModel } from '../schemas/session.schema';
import ISessionRepository from 'src/@core/domain/repositories/i.session.repository';

@Injectable()
export default class SessionRepository extends Repository<Session, ISessionModel> implements ISessionRepository {
  public constructor(@InjectModel(Session.name) sessionModel: Model<ISessionModel>) {
    super(sessionModel);
  }

  async findDetailSession(id: string): Promise<Session> {
    const doc = await this._model.findById(id).populate('tasks').exec();
    if (!doc) {
      return null
    }
    return this.convertDocumentToEntity(doc);
  }

  async findOneBySessionKey(sessionKey: string): Promise<Session | null> {
    const doc = await this._model.findOne({ sessionKey }).exec();
    if (!doc) {
      return null
    }
    return this.convertDocumentToEntity(doc);
  }

  public async findBySessionKey(sessionKey: string): Promise<Session[]> {
    const match = new RegExp(`${sessionKey}`);
    const doc = await this._model.find({ sessionKey: match }).populate('tasks').exec();
    return doc.map((d) => this.convertDocumentToEntity(d));
  }

  public async findOneByFilter(filter: any): Promise<Session | null> {
    const doc = await this._model.findOne(filter).exec();
    if (!doc) {
      return null;
    }
    return this.convertDocumentToEntity(doc);
  }


  protected convertDocumentToEntity(persist: SessionDocument): Session {
    const { _id, ...props } = persist.toObject();

    const entity = Session.create(
      {
        sessionKey: props.sessionKey,
        timeInspect: props.timeInspect,
        status: props.status,
        group: props.group,
        tasks: props.tasks || [],
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      },

      EntityID.create({ value: _id.toString() }),
    );

    return entity;
  }

  protected convertEntityToDocument(entity: Session): SessionDocument {
    const document = {
      _id: entity.id?.value,
      sessionKey: entity.sessionKey,
      timeInspect: entity.timeInspect,
      status: entity.status,
      group: entity.group,
      tasks: entity.tasks || [],
      createdAt: entity.createdAt || new Date(),
      updatedAt: entity.updatedAt || new Date(),
    };

    const persist = new SessionModel(document);

    return persist;
  }
}
