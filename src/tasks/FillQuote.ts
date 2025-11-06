import { Task, the, PerformsActivities, UsesAbilities } from '@serenity-js/core';
import { Enter, Click, isVisible, Press } from '@serenity-js/web';
import { QuotingPage } from '../userinterfaces/QuotingPage';
import { Wait } from '@serenity-js/core';
import data from '../utils/quote.json';

export class FillQuote extends Task {

    static LTL() {
        return new FillQuote();
    }

    constructor() {
        super(the`#actor fill the quote`);
    }


    async performAs(actor: UsesAbilities & PerformsActivities): Promise<void> {
        do {
            await actor.attemptsTo(
                Wait.until(QuotingPage.OriginZIP, isVisible()),
                Enter.theValue("").into(QuotingPage.OriginZIP),
                Enter.theValue(data.origin.postalCode).into(QuotingPage.OriginZIP),
                Press.the('ArrowDown'),
                Press.the('Enter')
            );
        } while (Wait.until(QuotingPage.OriginListbox, isVisible()));

        await actor.attemptsTo(
            Press.the('ArrowDown'),
            Press.the('Tab')
        );

        do {
            await actor.attemptsTo(
                Wait.until(QuotingPage.DestinationZIP, isVisible()),
                Enter.theValue("").into(QuotingPage.DestinationZIP),
                Enter.theValue(data.destination.postalCode).into(QuotingPage.DestinationZIP),
                Press.the('ArrowDown'),
                Press.the('Enter')
            );
        } while (Wait.until(QuotingPage.DestinationListbox, isVisible()));

        await actor.attemptsTo(
            Press.the('ArrowDown'),
            Press.the('Tab')
        );
    }
}
