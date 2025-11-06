import { Task, the, PerformsActivities } from '@serenity-js/core';
import { Hover, isVisible, Click } from '@serenity-js/web';
import { HomePage } from '../userinterfaces/HomePage';
import { Wait, Duration } from '@serenity-js/core';
import data from '../utils/quote.json';

export class OpenQuoting extends Task {

    static LTL() {
        return new OpenQuoting();
    }

    constructor() {
        super(the`#actor enters to creation quote`);
    }

    async performAs(actor: PerformsActivities): Promise<void> {
        await actor.attemptsTo(
            Wait.for(Duration.ofSeconds(15)),
            Wait.until(HomePage.Menu, isVisible()),
            Hover.over(HomePage.Menu),
            Wait.until(HomePage.QuotingOption, isVisible()),
            Click.on(HomePage.QuotingOption),
            Click.on(HomePage.QuotingLTL)
        );
    }
}