import { Question, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { Page } from '@serenity-js/web';

export class PageTitle extends Question<Promise<string>> {

  static ofThePage() {
    return new PageTitle();
  }

  constructor() {
    super(`#actor gets the page title`);
  }

  async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
    return Page.current().title().answeredBy(actor);
  }
}