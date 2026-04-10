import { Task, the, PerformsActivities, UsesAbilities, Wait, Duration } from '@serenity-js/core';
import { Click, isVisible } from '@serenity-js/web';
import { BookingPage } from '../userinterfaces/BookingPage';

export class ConfirmBooking extends Task {

  static now() {
    return new ConfirmBooking();
  }

  constructor() {
    super(the`#actor confirms the booking`);
  }

  async performAs(actor: UsesAbilities & PerformsActivities): Promise<void> {
    let attempts = 0;
    let modalVisible = false;

    while (attempts < 3 && !modalVisible) {

      await actor.attemptsTo(
        Click.on(BookingPage.confirmBookingButton.nth(0)),
        Wait.for(Duration.ofSeconds(1))   // pequeño delay para que reaccione UI
      );

      try {
        await actor.attemptsTo(
          Wait.until(
            BookingPage.confirmBookingButton.nth(1),
            isVisible()
          )
        );

        modalVisible = true;

      } catch (error) {
        attempts++;
      }
    }

    // 🔴 si nunca apareció el modal → falla el test
    if (!modalVisible) {
      throw new Error('Confirm Booking modal did not appear after 3 attempts');
    }

    // ✅ click final en el modal
    await actor.attemptsTo(
      Click.on(BookingPage.confirmBookingButton.nth(1)),
      Wait.upTo(Duration.ofSeconds(120)).until(BookingPage.bookingConfirmedTitle, isVisible())
    );
  }
}