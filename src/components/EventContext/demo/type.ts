export interface Entity {
  title: string;
}

import { BaseEvents } from "@utils/EventEmitter";

export interface DemoEvents extends BaseEvents {
  reset: [entity: Entity];
}