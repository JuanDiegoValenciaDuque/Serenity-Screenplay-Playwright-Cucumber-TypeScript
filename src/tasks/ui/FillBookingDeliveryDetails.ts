import { Task, the, PerformsActivities, UsesAbilities } from '@serenity-js/core';
import { Enter, Click, Press } from '@serenity-js/web';
import { BookingPage } from '../../userinterfaces/BookingPage';
import { TestData } from '../../models/TestData';

export class FillBookingDeliveryDetails extends Task {
  static with(data: TestData) {
    return new FillBookingDeliveryDetails(data);
  }

  constructor(private data: TestData) {
    super(the`#actor fills delivery details`);
  }

  async performAs(actor: UsesAbilities & PerformsActivities): Promise<void> {
    const d = this.data;

    await actor.attemptsTo(
      // 🔹 Company
      Enter.theValue(String(d.DestinationCompany)).into(BookingPage.companyNameDelivery),

      // 🔹 Address 1
      Enter.theValue(String(d.DeliveryAddress1)).into(BookingPage.address1Delivery),
    );

    // 🔹 Address 2
    if (d.DeliveryAddress2 && d.DeliveryAddress2.trim() !== '') {
      await actor.attemptsTo(Enter.theValue(d.DeliveryAddress2).into(BookingPage.address2Delivery));
    }

    // 🔹 Reference
    if (d.DeliveryRef && d.DeliveryRef.trim() !== '') {
      await actor.attemptsTo(Enter.theValue(d.DeliveryRef).into(BookingPage.referenceNumberDelivery));
    }

    await actor.attemptsTo(
      // 🔹 Contact
      Enter.theValue(String(d.DeliveryContact)).into(BookingPage.contactNameDelivery),
      Enter.theValue(String(d.DeliveryPhone)).into(BookingPage.contactPhone.nth(1)),
      Enter.theValue(String(d.DeliveryEmail)).into(BookingPage.emailDelivery),

      // 🔹 Time From
      Click.on(BookingPage.timeFrom.nth(1)),
      Click.on(BookingPage.timeOption('05:00')),

      // 🔹 Time To
      Click.on(BookingPage.timeTo.nth(1)),
      Click.on(BookingPage.timeOption('08:00')),

      // 🔹 opcional: salir del campo
      Press.the('Tab'),
    );
  }
}
