import { Task, the, PerformsActivities } from '@serenity-js/core';
import { Enter, Click  } from '@serenity-js/web';
import { LoginPage } from '../userinterfaces/LoginPage';
import data from '../utils/quote.json';

export class Log extends Task {
    
    static in() {
        const username:string= data.credentials.user;
        const password:string= data.credentials.password;
        return new Log(username, password);
    }

    constructor(private readonly username: string, private readonly password: string) {
        super(the`#actor write the email ${ username }`);
    }

    async performAs(actor: PerformsActivities): Promise<void> {
        await actor.attemptsTo(
            Enter.theValue(this.username).into(LoginPage.EmailField),
            Click.on(LoginPage.LoginButton),
            Enter.theValue(this.password).into(LoginPage.PasswordField),
            Click.on(LoginPage.LoginButton)
        );
    }
}
