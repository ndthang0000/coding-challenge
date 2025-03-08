// src/services/session.service.ts
import { SessionResponse } from '@api/presentation/response/session.response';
import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import Session, { GroupType, SessionStatus } from 'src/@core/domain/entities/session.entity';
import EntityID from 'src/@core/domain/value-objects/EntityID';
import SessionRepository from 'src/@core/infrastructure/mongoose/repository/session.repository';
import { TaskService } from './task.service';

@Injectable()
export class SessionService {

  constructor(
    @Inject() private readonly sessionRepo: SessionRepository,

    @Inject(forwardRef(() => TaskService))
    private readonly taskService: TaskService,
  ) {
    this.mappingSessionToResponse = this.mappingSessionToResponse.bind(this);
  }

  async findDetailSession(id: string): Promise<SessionResponse | null> {
    const session = await this.sessionRepo.findDetailSession(id);
    if (!session) {
      throw new BadRequestException('Session not found');
    }
    return this.mappingSessionToResponse(session);
  }

  async findSessionByKey(sessionKey: string): Promise<SessionResponse[]> {
    const listSession = await this.sessionRepo.findBySessionKey(sessionKey);
    return listSession.map(this.mappingSessionToResponse);
  }

  async findOneSessionByKey(sessionKey: string): Promise<SessionResponse | null> {
    const session = await this.sessionRepo.findOneBySessionKey(sessionKey);
    if (!session) {
      return null;
    }
    return this.mappingSessionToResponse(session);
  }

  async findOneByFilter(filter: any): Promise<SessionResponse | null> {
    const session = await this.sessionRepo.findOneByFilter(filter);
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

  async addTaskToSession(session: SessionResponse, taskId: string) {
    const sessionEntity = await this.sessionRepo.findOneById(EntityID.create({ value: session.id }));

    if (!sessionEntity) {
      throw new BadRequestException('Session not found');
    }
    sessionEntity.addTask(taskId);
    sessionEntity.updateStatus(SessionStatus.IN_PROGRESS);
    await this.sessionRepo.update(sessionEntity);

  }


  async updateSessionStatus(sessionId: string, status: SessionStatus) {
    const session = await this.sessionRepo.findOneById(EntityID.create({ value: sessionId }));
    if (!session) {
      throw new BadRequestException('Session not found');
    }
    session.updateStatus(status);
    await this.sessionRepo.update(session);
  }

  mappingSessionToResponse(session: Session): SessionResponse {
    return {
      id: session.id?.value,
      sessionKey: session.sessionKey,
      timeInspect: session.timeInspect,
      group: session.group,
      status: session.status,
      tasks: session.tasks.map(this.taskService.convertDocumentToResponse),
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}