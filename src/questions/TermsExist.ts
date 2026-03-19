import { Question, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { Wait } from '@serenity-js/core';
import { isVisible } from '@serenity-js/web';
import { HomePage } from '../userinterfaces/HomePage';


export class TermsExist extends Question<Promise<boolean>> {

    static check() {
        return new TermsExist();
    }

    constructor() {
        super(`#actor checks if Terms heading exists`);
    }

    async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<boolean> {

        try {
            await (actor as any).attemptsTo(
                Wait.until(HomePage.Terms, isVisible())
            );

            return true;
        } catch (error) {
            return false;
        }
    }
}