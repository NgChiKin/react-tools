export interface Entity {
  title: string;
}

import { BaseEvents } from "@utils/EventEmitter";

export interface DemoEvents extends BaseEvents {
  addTodo: [entity: Entity];
}