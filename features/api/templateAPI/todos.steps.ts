import { Given, Then, When } from '@cucumber/cucumber';
import { actorCalled, actorInTheSpotlight } from '@serenity-js/core';
import { Ensure, equals } from '@serenity-js/assertions';
import { LastResponse } from '@serenity-js/rest';
import { GetTodo } from '../../../src/tasks/api/GetTodo';
import { TodoResponse } from '../../../src/questions/api/TodoResponse';

Given('the actor calls the API', () => {
    actorCalled('API Actor');
});

When('the actor requests TODO with id {int}', async (id: number) => {
    await actorInTheSpotlight().attemptsTo(GetTodo.withId(id));
});

Then('the response status should be {int}', async (expectedStatus: number) => {
    await actorInTheSpotlight().attemptsTo(
        Ensure.that(LastResponse.status(), equals(expectedStatus))
    );
});

Then('the userId should be {int}', async (expectedUserId: number) => {
    await actorInTheSpotlight().attemptsTo(
        Ensure.that(TodoResponse.userId(), equals(expectedUserId))
    );
});
