// src/services/session.service.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Session, { GroupType, SessionStatus } from 'src/@core/domain/entities/session.entity';
import EntityID from 'src/@core/domain/value-objects/EntityID';
import SessionRepository from 'src/@core/infrastructure/mongoose/repository/session.repository';

@Injectable()
export class SessionService {

  constructor(
    @Inject() private readonly sessionRepo: SessionRepository,
  ) { }

  async findDetailSession(id: string) {
    const session = await this.sessionRepo.findDetailSession(id);
    if (!session) {
      throw new BadRequestException('Session not found');
    }
    return this.mappingSessionToResponse(session);
  }

  async findSessionByKey(sessionKey: string) {
    const listSession = await this.sessionRepo.findBySessionKey(sessionKey);
    return listSession.map(this.mappingSessionToResponse);
  }

  async findOneSessionByKey(sessionKey: string) {
    const session = await this.sessionRepo.findOneBySessionKey(sessionKey);
    if (!session) {
      return null;
    }
    return this.mappingSessionToResponse(session);
  }

  async createSession(sessionKey: string, timeInspect: number, group: GroupType) {
    const session = Session.create({
      sessionKey,
      timeInspect,
      group,
      tasks: [],
      status: SessionStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.sessionRepo.add(session);
  }

  mappingSessionToResponse(session: Session) {
    return {
      id: session.id?.value,
      sessionKey: session.sessionKey,
      timeInspect: session.timeInspect,
      group: session.group,
      status: session.status,
      tasks: session.tasks,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}