import { Then, When } from '@cucumber/cucumber';
import { actorInTheSpotlight, Check, notes } from '@serenity-js/core';
import { FillDinamicQuote } from '../../src/tasks/FillDinamicQuote';
import { SelectRandomRate } from '../../src/tasks/SelectRandomRate';
import { FillBookingPickUpDetails } from '../../src/tasks/FillBookingPickUpDetails';
import { FillBookingDeliveryDetails } from '../../src/tasks/FillBookingDeliveryDetails';
import { isTrue } from '@serenity-js/assertions';
import { GLCodeThirdParty } from '../../src/tasks/GLCodeThirdParty';
import { ConfirmBooking } from '../../src/tasks/ConfirmBooking';


When('the user fills booking a new LTL quote using Excel data', async function () {
  await actorInTheSpotlight().attemptsTo(FillDinamicQuote.ltl(this.testData));
});

Then('the bol is displayed', async () => {
  // Write code here that turns the phrase above into concrete actions
})

When('the users choose one rate and fills booking form', async () => {
  await actorInTheSpotlight().attemptsTo(SelectRandomRate.andBook());
})

When('the user fill the booking information', async function () {
  await actorInTheSpotlight().attemptsTo(
    Check.whether(notes().get('bookeable').answeredBy(actorInTheSpotlight()), isTrue())
      .andIfSo(
        FillBookingPickUpDetails.with(this.testData),
        FillBookingDeliveryDetails.with(this.testData),
        GLCodeThirdParty.with(this.testData),
        ConfirmBooking.now())
  )
})


