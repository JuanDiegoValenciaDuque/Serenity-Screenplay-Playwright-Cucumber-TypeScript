import { AnswersQuestions, Question, UsesAbilities } from '@serenity-js/core';
import { LastResponse } from '@serenity-js/rest';

export class TodoResponse {
    static userId() {
        return Question.about('response userId', actor =>
            actor.answer(
                LastResponse.body<{ userId: number }>()
            ).then(body => {
                return body.userId;
            })
        );
    }
}