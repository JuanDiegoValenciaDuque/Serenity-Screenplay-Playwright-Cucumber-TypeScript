import { PageElement, By } from '@serenity-js/web';

export class QuotingPage {


    static get OriginZIP() {
        return PageElement.located(By.xpath("//input[@id='origin']"))
            .describedAs("Origin Input");
    }

    static get DestinationZIP() {
        return PageElement.located(By.xpath("//input[@id='destination']"))
            .describedAs("Destination Input");
    }

    static get OriginListbox() {
        return PageElement.located(By.id('origin-listbox'))
            .describedAs('Destination dropdown list');
    }

    static get DestinationListbox() {
        return PageElement.located(By.id('destination-listbox'))
            .describedAs('Destination dropdown list');
    }
}