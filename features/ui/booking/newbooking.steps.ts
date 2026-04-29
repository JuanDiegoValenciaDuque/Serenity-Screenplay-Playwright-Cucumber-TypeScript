import { Then, When } from '@cucumber/cucumber';
import { actorInTheSpotlight, Check, notes } from '@serenity-js/core';
import { FillDynamicQuote } from '../../../src/tasks/ui/FillDynamicQuote';
import { SelectRandomRate } from '../../../src/tasks/ui/SelectRandomRate';
import { FillBookingPickUpDetails } from '../../../src/tasks/ui/FillBookingPickUpDetails';
import { FillBookingDeliveryDetails } from '../../../src/tasks/ui/FillBookingDeliveryDetails';
import { isTrue } from '@serenity-js/assertions';
import { GLCodeThirdParty } from '../../../src/tasks/ui/GLCodeThirdParty';
import { ConfirmBooking } from '../../../src/tasks/ui/ConfirmBooking';
import { IsQuoteBookable } from '../../../src/questions/ui/IsQuoteBookable';


When('the user fills booking a new LTL quote using Excel data', async function () {
  await actorInTheSpotlight().attemptsTo(FillDynamicQuote.ltl(this.testData));
});

Then('the bol is displayed', async () => {
  
})

When('the users choose one rate and fills booking form', async function () {
  await actorInTheSpotlight().attemptsTo(
    notes().set('isBookeable', IsQuoteBookable.for(this.testData)),
    SelectRandomRate.andBook(notes().get('isBookeable')),
  );
})

When('the user fill the booking information', async function () {
  await actorInTheSpotlight().attemptsTo(
    Check.whether(notes().get('isBookeable'), isTrue())
      .andIfSo(
        FillBookingPickUpDetails.with(this.testData),
        FillBookingDeliveryDetails.with(this.testData),
        GLCodeThirdParty.with(this.testData),
        ConfirmBooking.now())
  )
})


