import { Task, the, PerformsActivities } from '@serenity-js/core';
import { Enter, Click } from '@serenity-js/web';
import { LoginPage } from '../userinterfaces/LoginPage';
import * as fs from 'fs';
import { Decryptor } from '../../security/decryptor';

export class Log extends Task {

  static in() {
    return new Log();
  }

  constructor() {
    super(the`#actor logs in using secure credentials`);
  }

  async performAs(actor: PerformsActivities): Promise<void> {
    const key = process.env.KEY ?? 'default_key';
    const data = JSON.parse(fs.readFileSync('credentials.enc', 'utf-8'));
    const password = Decryptor.decrypt(data.password, key);
    await actor.attemptsTo(
      Enter.theValue(data.user).into(LoginPage.EmailField),
      Click.on(LoginPage.LoginButton),
      Enter.theValue(password).into(LoginPage.PasswordField),
      Click.on(LoginPage.LoginButton)
    );
  }
}