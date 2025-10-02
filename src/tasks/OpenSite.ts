import { Task, the, PerformsActivities } from '@serenity-js/core';
import { Navigate } from '@serenity-js/web';

export class OpenSite extends Task {
    static at(url: string) {
        return new OpenSite(url);
    }

    constructor(private readonly url: string) {
        super(the`#actor opens the site at ${ url }`);
    }

    async performAs(actor: PerformsActivities): Promise<void> {
        await actor.attemptsTo(
            Navigate.to(this.url),
        );
    }
}
