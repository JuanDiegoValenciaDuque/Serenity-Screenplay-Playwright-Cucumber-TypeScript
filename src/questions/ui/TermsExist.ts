import { Question, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { HomePage } from '../../userinterfaces/HomePage';

export class TermsExist extends Question<Promise<boolean>> {
  static check() {
    return new TermsExist();
  }

  constructor() {
    super(`#actor checks if Terms heading exists`);
  }

  async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<boolean> {
    const element = await HomePage.Terms.answeredBy(actor);
    return element.isVisible();
  }
}
