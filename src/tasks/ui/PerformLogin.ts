import 'dotenv/config';
import { Task, the, PerformsActivities } from '@serenity-js/core';
import { Enter, Click } from '@serenity-js/web';
import { LoginPage } from '../../userinterfaces/LoginPage';

export class PerformLogin extends Task {

    static with(username?: string, password?: string) {
        return new PerformLogin(
            username ?? process.env.USER_EMAIL ?? '',
            password ?? process.env.USER_PASSWORD ?? '',
        );
    }

    constructor(
        private readonly username: string,
        private readonly password: string
    ) {
        super(the`#actor logs in as ${ username }`);
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