import { Task, the, PerformsActivities, UsesAbilities } from '@serenity-js/core';
import { Enter, Click, Press } from '@serenity-js/web';
import { BookingPage } from '../../userinterfaces/BookingPage';
import { TestData } from '../../models/TestData';

export class FillBookingPickUpDetails extends Task {
  static with(data: TestData) {
    return new FillBookingPickUpDetails(data);
  }

  constructor(private data: TestData) {
    super(the`#actor fills pickup details`);
  }

  async performAs(actor: UsesAbilities & PerformsActivities): Promise<void> {
    const d = this.data;

    await actor.attemptsTo(
      // 🔹 Company
      Enter.theValue(String(d.OriginCompany)).into(BookingPage.companyNamePickUP),

      // 🔹 Address 1
      Enter.theValue(String(d.OriginAddress1)).into(BookingPage.address1PickUP),
    );

    // 🔹 Address 2
    if (d.OriginAddress2 && d.OriginAddress2.trim() !== '') {
      await actor.attemptsTo(Enter.theValue(d.OriginAddress2).into(BookingPage.address2PickUP));
    }

    // 🔹 Reference
    if (d.PickupRef && d.PickupRef.trim() !== '') {
      await actor.attemptsTo(Enter.theValue(d.PickupRef).into(BookingPage.referenceNumberPickUP));
    }

    await actor.attemptsTo(
      // 🔹 Contact
      Enter.theValue(String(d.PickupContact)).into(BookingPage.contactNamePickUP),
      Enter.theValue(String(d.PickupPhone)).into(BookingPage.contactPhone.nth(0)),
      Enter.theValue(String(d.PickupEmail)).into(BookingPage.contactEmail),

      // 🔹 Date (today at runtime)
      Enter.theValue(todayFormatted()).into(BookingPage.pickupDate.nth(0)),

      // 🔹 Time From
      Click.on(BookingPage.timeFrom.nth(0)),
      Click.on(BookingPage.timeOption('05:00')),

      // 🔹 Time To
      Click.on(BookingPage.timeTo.nth(0)),
      Click.on(BookingPage.timeOption('08:00')),

      // 🔹 opcional: salir del campo
      Press.the('Tab'),
    );
  }
}

function todayFormatted(): string {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${mm}/${dd}/${now.getFullYear()}`;
}
