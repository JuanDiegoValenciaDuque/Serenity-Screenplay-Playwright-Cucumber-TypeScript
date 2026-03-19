import { Task, the, PerformsActivities, Wait } from '@serenity-js/core';
import { Enter, Click, isVisible } from '@serenity-js/web';
import { LoginPage } from '../userinterfaces/LoginPage';
import { HomePage } from '../userinterfaces/HomePage';
 
export class Log extends Task {
 
    static in(username: string, password: string) {
        return new Log(username, password);
    }
 
    constructor(
        private readonly username: string,
        private readonly password: string
    ) {
        super(the`#actor logs in with ${ username }`);
    }
 
    async performAs(actor: PerformsActivities): Promise<void> {
        await actor.attemptsTo(
            Enter.theValue(this.username).into(LoginPage.EmailField),
            Click.on(LoginPage.LoginButton),
            Enter.theValue(this.password).into(LoginPage.PasswordField),
            Click.on(LoginPage.LoginButton),
            Wait.until(HomePage.Terms, isVisible())
        );
    }
}