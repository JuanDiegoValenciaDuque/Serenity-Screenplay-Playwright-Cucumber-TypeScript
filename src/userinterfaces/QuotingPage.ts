import { PageElement, By, PageElements } from '@serenity-js/web';

export class QuotingPage {
  static get OriginZIP() {
    return PageElement.located(By.xpath("//input[@id='origin']")).describedAs('Origin Input');
  }

  static get DestinationZIP() {
    return PageElement.located(By.xpath("//input[@id='destination']")).describedAs('Destination Input');
  }

  static get OriginListbox() {
    return PageElement.located(By.id('origin-listbox')).describedAs('Origin dropdown list');
  }

  static get DestinationListbox() {
    return PageElement.located(By.id('destination-listbox')).describedAs('Destination dropdown list');
  }

  static get ItemNameInput() {
    return PageElement.located(By.xpath("//input[@id='itemName']")).describedAs('Item name input');
  }

  static get WidthInput() {
    return PageElement.located(By.xpath("//input[@name='width']")).describedAs('Item width input');
  }

  static get HeightInput() {
    return PageElement.located(By.xpath("//input[@name='height']")).describedAs('Item height input');
  }

  static get LengthInput() {
    return PageElement.located(By.xpath("//div[@label='Length']//input")).describedAs('Item length input');
  }

  static get WeightInput() {
    return PageElement.located(By.xpath("//input[@name='weight']")).describedAs('Item weight input');
  }

  static get GetBestRatesButton() {
    return PageElement.located(By.xpath("//button[normalize-space(.)='GET THE BEST RATES']")).describedAs(
      'Get the best rates button',
    );
  }
  static get CargoDetailsText() {
    return PageElement.located(By.xpath("//*[name()='text' and contains(., 'CARGO DETAILS')]")).describedAs(
      'Text Cargo Details',
    );
  }  

    static get PriceRates() {
    return PageElements.located(By.xpath("//h6[starts-with(normalize-space(),'$')]")).describedAs(
      'Price Rates',
    );
  }    
}
