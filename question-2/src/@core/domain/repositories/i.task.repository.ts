import IRepository from './i.repository';
import Task from '../entities/task.entity';

export default interface ITaskRepository extends IRepository<Task> {

}
