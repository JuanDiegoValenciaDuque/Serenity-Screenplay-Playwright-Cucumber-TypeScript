import { Task, the, PerformsActivities, UsesAbilities, Wait, Duration } from '@serenity-js/core';
import { TestData } from '../../models/TestData';
import { Click, Enter, isEnabled, isVisible } from '@serenity-js/web';
import { BookingPage } from '../../userinterfaces/BookingPage';

export class GLCodeThirdParty extends Task {
  static with(data: TestData) {
    return new GLCodeThirdParty(data);
  }

  constructor(private data: TestData) {
    super(the`#actor fills GLCodeThirdParty details`);
  }

  async performAs(actor: UsesAbilities & PerformsActivities): Promise<void> {
    const d = this.data;

    await actor.attemptsTo(
      // Enterprise Tag
      Click.on(BookingPage.enterpriseTag),
      Wait.until(BookingPage.dropdownOptions.first(), isVisible()),
      Click.on(BookingPage.dropdownOptions.first()),

      // District
      Click.on(BookingPage.district),
      Wait.until(BookingPage.dropdownOptions.first(), isVisible()),
      Click.on(BookingPage.dropdownOptions.first()),

      // GL Code
      Click.on(BookingPage.glCode),
      Wait.until(BookingPage.dropdownOptions.first(), isVisible()),
      Click.on(BookingPage.dropdownOptions.first()),

      ...(d.ThirdPartyReference
        ? [Enter.theValue(String(d.ThirdPartyReference)).into(BookingPage.thirdPartyReference)]
        : []),

      // 🔹 Additional Reference + Reference Name (dependientes)
      ...(d.AdditionalReference
        ? [
            Enter.theValue(String(d.AdditionalReference)).into(BookingPage.additionalReference.nth(2)),

            // 🔥 esperar a que se habilite el campo dependiente
            Wait.until(BookingPage.referenceName, isEnabled()),

            Enter.theValue(String(d.ReferenceNumber)).into(BookingPage.referenceName),
          ]
        : []),

      Wait.for(Duration.ofSeconds(3)),
    );
  }
}
