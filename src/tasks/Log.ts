import { Task, the, PerformsActivities } from '@serenity-js/core';
import { Enter, Click  } from '@serenity-js/web';
import { LoginPage } from '../userinterfaces/LoginPage';
import { CredentialsProvider } from '../../security/CredentialsProvider';

export class Log extends Task {
    
  static in() {
    return new Log();
  }

constructor() {
    super(the`#actor logs in using secure credentials`);
  }

    async performAs(actor: PerformsActivities): Promise<void> {
        const { user, password } = CredentialsProvider.get();
        await actor.attemptsTo(
            Enter.theValue(user).into(LoginPage.EmailField),
            Click.on(LoginPage.LoginButton),
            Enter.theValue(password).into(LoginPage.PasswordField),
            Click.on(LoginPage.LoginButton)
        );
    }
}
