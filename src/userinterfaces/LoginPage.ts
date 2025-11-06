import { PageElement, By } from '@serenity-js/web';

export class LoginPage {

  
    static get LoginButton() {
        return PageElement.located(By.xpath("//button[@value='login']"))
            .describedAs("Login Button");
    }

    static get EmailField() {
        return PageElement.located(By.xpath("//input[@id='Input_Username']"))
            .describedAs("Email Field");
    }

    static get PasswordField() {
        return PageElement.located(By.xpath("//input[@id='Input_Password']"))
            .describedAs("Email Field");
    }
}