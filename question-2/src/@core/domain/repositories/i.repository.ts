import { IEntity } from '../entities/entity';
import EntityID from '../value-objects/EntityID';

export default interface IRepository<T extends IEntity> {
  add(entity: T): Promise<T>;
  delete(entity: T): Promise<T>;
  deleteById(id: EntityID): Promise<void>;
  update(entity: T): Promise<T>;
  findOneById(id: EntityID): Promise<T | null>;
  all(): Promise<T[]>;
}
