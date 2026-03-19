import { Interaction, Actor, d, Answerable, Wait, Duration } from '@serenity-js/core';
import { Enter, Press, PageElement } from '@serenity-js/web';

export class FillZipAuto extends Interaction {
  static with(
    input: Answerable<PageElement>,
    listbox: Answerable<PageElement>,
    value: string,
    timeoutMs = 10000,
  ): FillZipAuto {
    return new FillZipAuto(input, listbox, value, timeoutMs);
  }

  private constructor(
    private readonly input: Answerable<PageElement>,
    private readonly listbox: Answerable<PageElement>,
    private readonly value: string,
    private timeoutMs: number,
  ) {
    super(d`Fill ZIP ${value} using autocomplete`);
  }

  async performAs(actor: Actor): Promise<void> {
    const start = Date.now();

    while (Date.now() - start < this.timeoutMs) {
      await actor.attemptsTo(Enter.theValue('').into(this.input), Enter.theValue(this.value).into(this.input));

      await actor.attemptsTo(Wait.for(Duration.ofSeconds(2)));

      const listboxElement = await actor.answer(this.listbox);
      const visible = await actor.answer(listboxElement.isVisible());

      if (visible) {
        await actor.attemptsTo(Press.the('ArrowDown'), Press.the('Enter'));
        return;
      }
    }
  }
}
