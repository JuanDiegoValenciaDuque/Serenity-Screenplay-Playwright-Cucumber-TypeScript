import { PageElement, By } from '@serenity-js/web';

export class HomePage {


    static get Menu() {
        return PageElement.located(By.xpath('//*[@id="root"]//*[@class="MuiBox-root css-9uivp0 e1de0imv0"]'))
            .describedAs("Menu");
    }

      static get QuotingOption() {
        return PageElement.located(By.xpath("(//span[(text())='Quoting'])[1]"))
            .describedAs("QuotingOption");
    }

    

      static get QuotingLTL() {
        return PageElement.located(By.xpath("//span[normalize-space(text())='LTL/FTL']"))
            .describedAs("LTL/FTL");
    }
}