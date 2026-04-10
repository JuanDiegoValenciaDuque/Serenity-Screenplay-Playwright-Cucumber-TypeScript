import { Task, the, PerformsActivities, UsesAbilities, Wait, Duration, notes } from '@serenity-js/core';
import { Enter, Click, isVisible, Press } from '@serenity-js/web';
import { QuotingPage } from '../userinterfaces/QuotingPage';
import { FillZipAuto } from '../interactions/FillZipAuto';
import { TestData } from '../models/TestData';
import { equals } from '@serenity-js/assertions';
import { getCommodities } from '../utils/commodityHelper';

export class FillDinamicQuote extends Task {

    static ltl(data: TestData) {
        return new FillDinamicQuote(data);
    }

    constructor(private data: TestData) {
        super(the`#actor fills the quote using Excel data`);
    }

    async performAs(actor: UsesAbilities & PerformsActivities): Promise<void> {
        const commodities = getCommodities(this.data);
        const d = this.data;

        // 🔹 llenar datos base (UNA SOLA VEZ)
        await actor.attemptsTo(
             notes().set('bookeable', true),
            FillZipAuto.with(QuotingPage.OriginZIP, QuotingPage.OriginListbox, d.OriginZip),
            FillZipAuto.with(QuotingPage.DestinationZIP, QuotingPage.DestinationListbox, d.DestinationZip),
        );

        // 🔥 LOOP ÚNICO → crear + llenar
        for (let i = 0; i < commodities.length; i++) {

            const c = commodities[i];

            // 👉 SOLO crea nuevo item si NO es el primero
            if (i > 0) {

                const expectedCount = i + 1;

                await actor.attemptsTo(
                    Click.on(QuotingPage.AddItemButton)
                );

                try {
                    await actor.attemptsTo(
                        Wait.for(Duration.ofSeconds(2)),
                        Press.the('Tab'),
                        Wait.until(
                            QuotingPage.ItemNameInputs.count(),
                            equals(expectedCount)
                        )
                    );
                } catch {
                    await actor.attemptsTo(
                        Wait.for(Duration.ofSeconds(2)),
                        Click.on(QuotingPage.AddItemButton),
                        Press.the('Tab'),
                        Wait.until(
                            QuotingPage.ItemNameInputs.count(),
                            equals(expectedCount)
                        )
                    );
                }
            }

            // 👉 llenar el item actual
            if (c.length === 0 && c.width === 0 && c.height === 0) {
                

                await actor.attemptsTo(
                    notes().set('bookeable', false),
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

        // 🔹 acciones finales
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