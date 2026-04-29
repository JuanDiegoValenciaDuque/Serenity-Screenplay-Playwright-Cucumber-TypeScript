import { Interaction, PerformsActivities, UsesAbilities, AnswersQuestions, Wait, Duration } from '@serenity-js/core';
import { Click, isVisible } from '@serenity-js/web';
import { BookingPage } from '../userinterfaces/BookingPage';

export class ConfirmBookingModal extends Interaction {

    static open() {
        return new ConfirmBookingModal();
    }

    constructor() {
        super(`#actor opens the confirm booking modal`);
    }

    async performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {
        const performing = actor as unknown as UsesAbilities & PerformsActivities;
        let attempts = 0;

        while (attempts < 3) {
            await performing.attemptsTo(
                Click.on(BookingPage.confirmBookingButton.nth(0)),
                Wait.for(Duration.ofSeconds(1)),
            );

            try {
                await performing.attemptsTo(
                    Wait.until(BookingPage.confirmBookingButton.nth(1), isVisible())
                );
                return;
            } catch {
                attempts++;
            }
        }

        throw new Error('Confirm Booking modal did not appear after 3 attempts');
    }
}
