import { Question, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { By } from '@serenity-js/web';
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright';

export class TextExist extends Question<Promise<string>> {

    static ofHeading() {
        return new TextExist(By.css('h1'));
    }

    constructor(private readonly locator: By) {
        super(`#actor get the tittle page of google`);
    }

     async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
        const page = await BrowseTheWebWithPlaywright.as(actor).currentPage();
        return page.title();
    }
}