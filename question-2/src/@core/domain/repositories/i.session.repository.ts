import IRepository from './i.repository';
import Session from '../entities/session.entity';

export default interface ISessionRepository extends IRepository<Session> {
  findBySessionKey(sessionKey: string): Promise<Session[]>;
  findOneBySessionKey(sessionKey: string): Promise<Session | null>;
  findDetailSession(id: string): Promise<Session>;
  findOneByFilter(filter: any): Promise<Session | null>;
}
