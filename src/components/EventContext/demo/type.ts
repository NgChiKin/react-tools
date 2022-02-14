export interface TodoEntity {
  title: string;
}

import { BaseEvents } from "@utils/EventEmitter";

export interface TodoEvents extends BaseEvents {
  addTodo: [entity: TodoEntity];
}