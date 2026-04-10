import { PageElement, By, PageElements } from '@serenity-js/web';

export class BookingPage {

  static get pickupAddressTitle() {
    return PageElement.located(
      By.xpath("//h2[normalize-space()='Pickup address']")
    ).describedAs('Pickup address title');
  }

    static get companyNamePickUP() {
    return PageElement.located(By.id('companyName-pickup'))
      .describedAs('Pickup Company Name');
  }

  static get address1PickUP() {
    return PageElement.located(By.id('address1-pickup'))
      .describedAs('Pickup Address 1');
  }

  static get address2PickUP() {
    return PageElement.located(By.id('address2-pickup'))
      .describedAs('Pickup Address 2');
  }

  static get referenceNumberPickUP() {
    return PageElement.located(By.id('pickUpReference-pickup'))
      .describedAs('Pickup Reference Number');
  }

  static get contactNamePickUP() {
    return PageElement.located(By.id('contact-pickup'))
      .describedAs('Pickup Contact Name');
  }

  static get contactPhone() {
    return PageElements.located(By.id('contactPhone'))
      .describedAs('Pickup Contact Phone');
  }

  static get contactEmail() {
    return PageElement.located(By.id('email-pickup'))
      .describedAs('Pickup Contact Email');
  }

  static get pickupDate() {
    return PageElements.located(
      By.xpath("//input[@name='date']")
    ).describedAs('Pickup Date');
  }

  static get timeFrom() {
    return PageElements.located(By.id('mui-component-select-timeFrom'))
      .describedAs('Pickup Time From');
  }

  static get timeTo() {
    return PageElements.located(By.id('mui-component-select-timeTo'))
      .describedAs('Pickup Time To');
  }

  static timeOption(option: string) {
  return PageElement.located(
    By.xpath(`//li[normalize-space()='${ option }']`)
  ).describedAs(`Time option ${ option }`);
}

  static get companyNameDelivery() {
    return PageElement.located(By.id('companyName-delivery'))
      .describedAs('Delivery Company Name');
  }

  static get address1Delivery() {
    return PageElement.located(By.id('address1-delivery'))
      .describedAs('Delivery Address 1');
  }

  static get address2Delivery() {
    return PageElement.located(By.id('address2-delivery'))
      .describedAs('Delivery Address 2');
  }

  static get referenceNumberDelivery() {
    return PageElement.located(By.id('pickUpReference-delivery'))
      .describedAs('Delivery Reference Number');
  }

  static get contactNameDelivery() {
    return PageElement.located(By.id('contact-delivery'))
      .describedAs('Delivery Contact Name');
  }

  static get emailDelivery() {
    return PageElement.located(By.id('email-delivery'))
      .describedAs('Delivery Email');
  }

    static get enterpriseTag() {
    return PageElement.located(By.id('mui-component-select-enterpriseTag'))
      .describedAs('Enterprise Tag');
  }

  static get district() {
    return PageElement.located(By.id('mui-component-select-district'))
      .describedAs('District');
  }

  static get glCode() {
    return PageElement.located(By.id('mui-component-select-glCode'))
      .describedAs('GL Code');
  }

  static get dropdownOptions() {
    return PageElements.located(By.css('[role="option"]'))
      .describedAs('Dropdown options');
  }

    static get thirdPartyReference() {
    return PageElement.located(By.css('input[name="purchaseOrder"]'))
      .describedAs('Third Party Reference');
  }

  static get additionalReference() {
    return PageElements.located(By.css('input[name="referenceNumber"]'))
      .describedAs('Additional Reference Number');
  }

  static get referenceName() {
    return PageElement.located(By.css('input[name="referenceName"]'))
      .describedAs('Reference Name');
  }

    static get confirmBookingButton() {
    return PageElements.located(By.xpath("//button[.//text()[contains(.,'Confirm Booking')]]"))
      .describedAs('Confirm Booking button');
  }

    static get bookingConfirmedTitle() {
    return PageElement.located(By.xpath("//h2[normalize-space()='Confirmed']"))
      .describedAs('Booking Confirmed Title');
  }
}