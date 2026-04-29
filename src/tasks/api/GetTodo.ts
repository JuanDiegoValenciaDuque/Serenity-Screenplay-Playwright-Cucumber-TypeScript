import { Task } from '@serenity-js/core';
import { GetRequest, Send } from '@serenity-js/rest';

export class GetTodo {
  static withId(id: number) {
    return Task.where(`#actor requests TODO with id ${id}`, Send.a(GetRequest.to(`/todos/${id}`)));
  }
}
