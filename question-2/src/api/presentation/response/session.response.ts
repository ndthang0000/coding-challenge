import { TaskResponse } from "./task.response";


export interface SessionResponse {
  id: string;
  sessionKey: string;
  timeInspect: number;
  group: string;
  status: string;
  tasks: TaskResponse[];
  createdAt: Date;
  updatedAt: Date;
}