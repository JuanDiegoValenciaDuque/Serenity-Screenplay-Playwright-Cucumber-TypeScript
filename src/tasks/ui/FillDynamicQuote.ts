import { Task, the, PerformsActivities, UsesAbilities, Wait, Duration } from '@serenity-js/core';
import { Enter, Click, isVisible, Press } from '@serenity-js/web';
import { QuotingPage } from '../../userinterfaces/QuotingPage';
import { FillZipAuto } from '../../interactions/FillZipAuto';
import { TestData } from '../../models/TestData';
import { equals } from '@serenity-js/assertions';
import { getCommodities } from '../../utils/commodityHelper';

export class FillDynamicQuote extends Task {

    static ltl(data: TestData) {
        return new FillDynamicQuote(data);
    }

    constructor(private data: TestData) {
        super(the`#actor fills the quote using Excel data`);
    }

    async performAs(actor: UsesAbilities & PerformsActivities): Promise<void> {
        const commodities = getCommodities(this.data);
        const d = this.data;

        await actor.attemptsTo(
            FillZipAuto.with(QuotingPage.OriginZIP, QuotingPage.OriginListbox, d.OriginZip),
            FillZipAuto.with(QuotingPage.DestinationZIP, QuotingPage.DestinationListbox, d.DestinationZip),
        );

        for (let i = 0; i < commodities.length; i++) {

            const c = commodities[i];

            if (i > 0) {

                const expectedCount = i + 1;

                if (i === 1) {
                    // UI behavior: first AddItem always requires two clicks to register
                    await actor.attemptsTo(
                        Click.on(QuotingPage.AddItemButton),
                        Wait.for(Duration.ofSeconds(1)),
                        Click.on(QuotingPage.AddItemButton),
                    );
                } else {
                    await actor.attemptsTo(
                        Click.on(QuotingPage.AddItemButton),
                    );
                }

                await actor.attemptsTo(
                    Press.the('Tab'),
                    Wait.upTo(Duration.ofSeconds(10)).until(
                        QuotingPage.ItemNameInputs.count(),
                        equals(expectedCount)
                    )
                );
            }

            if (c.length === 0 && c.width === 0 && c.height === 0) {

                await actor.attemptsTo(
                    Press.the('Tab'),
                    Enter.theValue(String(c.name)).into(QuotingPage.ItemNameInputs.nth(i)),
                    Press.the('Tab'),
                    Enter.theValue(String(c.weight)).into(QuotingPage.WeightInputs.nth(i)),
                    Press.the('Tab'),
                    Enter.theValue(String(c.volume)).into(QuotingPage.VolumeInputs.nth(i)),
                    Press.the('Tab'),
                );

            } else {

                await actor.attemptsTo(
                    Wait.for(Duration.ofSeconds(3)),
                    Press.the('Tab'),
                    Enter.theValue(String(c.name)).into(QuotingPage.ItemNameInputs.nth(i)),
                    Press.the('Tab'),
                    Enter.theValue(String(c.length)).into(QuotingPage.LengthInputs.nth(i)),
                    Press.the('Tab'),
                    Enter.theValue(String(c.width)).into(QuotingPage.WidthInputs.nth(i)),
                    Press.the('Tab'),
                    Enter.theValue(String(c.height)).into(QuotingPage.HeightInputs.nth(i)),
                    Press.the('Tab'),
                    Enter.theValue(String(c.weight)).into(QuotingPage.WeightInputs.nth(i)),
                    Press.the('Tab'),
                );
            }
        }

        await actor.attemptsTo(
            Wait.for(Duration.ofSeconds(3)),
            Click.on(QuotingPage.CargoDetailsText),
            Press.the('Tab'),
            Click.on(QuotingPage.GetBestRatesButton),
            Wait.upTo(Duration.ofSeconds(120))
                .until(QuotingPage.PriceRates.first(), isVisible())
        );
    }
}