// src/controllers/session.controller.ts
import { Controller, Post, Body, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { SessionService } from '../services/session.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CreateSessionDto } from '@api/presentation/requests/session/create-session.dto';
import { GetSessionByKeyDto } from '@api/presentation/requests/session/get-session-by-key.dto';

@Controller('sessions')
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    @InjectQueue('sessionQueue') private readonly sessionQueue: Queue,
  ) { }

  @Post()
  async createSession(@Body() dto: CreateSessionDto) {
    const { sessionKey, timeInspect, group } = dto;
    if (await this.sessionService.findOneSessionByKey(sessionKey)) {
      throw new BadRequestException('Session key is existed, please use another key');
    }
    await this.sessionQueue.add('createSession', { sessionKey, timeInspect, group });
    return { message: 'Session creation queued' };
  }

  @Get('/:id')
  async getSessionDetail(@Param('id') id: string) {
    return this.sessionService.findDetailSession(id);
  }

  @Get()
  async getSession(@Query() dto: GetSessionByKeyDto) {
    // validate sessionKey
    const { sessionKey } = dto;

    return this.sessionService.findSessionByKey(sessionKey);
  }
}