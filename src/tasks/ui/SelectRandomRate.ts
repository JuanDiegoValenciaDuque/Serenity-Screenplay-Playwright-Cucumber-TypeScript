import { Task, the, PerformsActivities, UsesAbilities, AnswersQuestions, Wait, Duration, Check, Answerable } from '@serenity-js/core';
import { Hover, Click, isVisible } from '@serenity-js/web';
import { QuotingPage } from '../../userinterfaces/QuotingPage';
import { BookingPage } from '../../userinterfaces/BookingPage';
import { isTrue } from '@serenity-js/assertions';

export class SelectRandomRate extends Task {

  static andBook(isBookable: Answerable<boolean>) {
    return new SelectRandomRate(isBookable);
  }

  constructor(private readonly isBookable: Answerable<boolean>) {
    super(the`#actor selects a random rate and books it`);
  }

  async performAs(actor: UsesAbilities & PerformsActivities & AnswersQuestions): Promise<void> {

    const count = await QuotingPage.rates.count().answeredBy(actor);
    const randomIndex = Math.floor(Math.random() * count);
    const randomRate = QuotingPage.rates.nth(randomIndex);

    await actor.attemptsTo(
      Hover.over(randomRate),
      Click.on(QuotingPage.infoButton),
      Check.whether(this.isBookable, isTrue())
        .andIfSo(
          Click.on(QuotingPage.bookButton),
          Wait.upTo(Duration.ofSeconds(30))
            .until(BookingPage.pickupAddressTitle, isVisible())
        )
    );
  }
}
