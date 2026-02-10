import { Task, the, PerformsActivities, UsesAbilities } from '@serenity-js/core';
import { Enter } from '@serenity-js/web';
import { QuotingPage } from '../userinterfaces/QuotingPage';
import { FillZipAuto } from '../interactions/FillZipAuto';
import data from '../utils/quote.json';

export class FillQuote extends Task {

    static LTL() {
        return new FillQuote();
    }

    constructor() {
        super(the`#actor fill the quote`);
    }

    async performAs(actor: UsesAbilities & PerformsActivities): Promise<void> {
        await actor.attemptsTo(
            FillZipAuto.with(
                QuotingPage.OriginZIP,
                QuotingPage.OriginListbox,
                data.origin.postalCode
            ),
            FillZipAuto.with(
                QuotingPage.DestinationZIP,
                QuotingPage.DestinationListbox,
                data.destination.postalCode
            ),
            Enter.theValue(data.items[0].itemName).into(QuotingPage.ItemNameInput),
            Enter.theValue(data.items[0].length).into(QuotingPage.LengthInput),
            Enter.theValue(data.items[0].width).into(QuotingPage.WidthInput),
            Enter.theValue(data.items[0].height).into(QuotingPage.HeightInput),
            Enter.theValue(data.items[0].weight).into(QuotingPage.WeightInput)
        );
    }
}