import { Task, the, PerformsActivities, UsesAbilities, Wait, Duration } from '@serenity-js/core';
import { Click, isVisible } from '@serenity-js/web';
import { BookingPage } from '../../userinterfaces/BookingPage';
import { ConfirmBookingModal } from '../../interactions/ConfirmBookingModal';

export class ConfirmBooking extends Task {
  static now() {
    return new ConfirmBooking();
  }

  constructor() {
    super(the`#actor confirms the booking`);
  }

  async performAs(actor: UsesAbilities & PerformsActivities): Promise<void> {
    await actor.attemptsTo(
      ConfirmBookingModal.open(),
      Click.on(BookingPage.confirmBookingButton.nth(1)),
      Wait.upTo(Duration.ofSeconds(120)).until(BookingPage.bookingConfirmedTitle, isVisible()),
    );
  }
}
