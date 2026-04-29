# CLAUDE.md — Serenity Screenplay Playwright Cucumber TypeScript

## Project Overview

Automation framework for the **PRIMO logistics platform** — a web portal for quoting (LTL, FTL, Drayage), booking, and integrations with Shipwell, PRIMUS, SAP.

- **Staging:** https://staging.prestabit.space
- **Production:** https://portal.primofabric.com / https://portal.heyprimo.com
- **Pattern:** Serenity/JS Screenplay Pattern (strict — no procedural code)
- **BDD:** Cucumber + Gherkin feature files
- **Browser automation:** Playwright (Chromium + WebKit)
- **API automation:** `@serenity-js/rest` with `CallAnApi` ability
- **Language:** TypeScript v5

---

## Tech Stack

| Package                     | Version | Role                                              |
| --------------------------- | ------- | ------------------------------------------------- |
| `@serenity-js/core`         | ^3.40.0 | Screenplay engine, actors, tasks, questions       |
| `@serenity-js/web`          | ^3.40.0 | PageElement, PageElements, Click, Enter, Wait     |
| `@serenity-js/playwright`   | ^3.40.0 | BrowseTheWebWithPlaywright ability                |
| `@serenity-js/assertions`   | ^3.40.0 | `equals`, `includes`, `isVisible`                 |
| `@serenity-js/rest`         | ^3.40.0 | CallAnApi ability, Send, GetRequest, LastResponse |
| `@serenity-js/cucumber`     | ^3.40.0 | Serenity BDD Cucumber formatter                   |
| `@serenity-js/serenity-bdd` | ^3.40.0 | HTML report generation                            |
| `@cucumber/cucumber`        | ^12.6.0 | Gherkin step binding                              |
| `playwright`                | ^1.58.2 | Browser launch and context                        |
| `typescript`                | ^5.9.3  | Type safety                                       |
| `xlsx`                      | ^0.18.5 | Excel test data reading                           |
| `dotenv`                    | ^17.3.1 | Environment variables                             |

---

## Folder Structure

```
Serenity-Screenplay-Playwright-Cucumber-TypeScript/
├── features/
│   ├── ui/                             ← UI (browser) test scenarios
│   │   ├── login/
│   │   │   ├── login.feature
│   │   │   ├── loginterms.feature
│   │   │   └── login.steps.ts
│   │   ├── booking/
│   │   │   ├── booking.feature
│   │   │   ├── excel.steps.ts          ← Excel data loading steps
│   │   │   └── newbooking.steps.ts
│   │   └── quoting/
│   │       ├── quoting.feature
│   │       └── quoting.steps.ts
│   │
│   └── api/                            ← API (no browser) test scenarios
│       └── templateAPI/
│           ├── todos.feature           ← @api @regression — GET /todos/{id}
│           └── todos.steps.ts
│
├── support/                            ← Framework setup (root level, NOT inside features/)
│   ├── Actors.ts                       ← Cast implementation
│   └── serenity.config.ts              ← BeforeAll/AfterAll, browser launch, Serenity configure()
│
├── src/
│   ├── tasks/
│   │   ├── ui/                         ← UI Tasks (browser interactions)
│   │   │   ├── OpenSite.ts
│   │   │   ├── PerformLogin.ts
│   │   │   ├── OpenQuoting.ts
│   │   │   ├── FillQuote.ts            ← Static quote (from quote.json)
│   │   │   ├── FillDynamicQuote.ts     ← Dynamic quote (from Excel TestData)
│   │   │   ├── SelectRandomRate.ts
│   │   │   ├── FillBookingPickUpDetails.ts
│   │   │   ├── FillBookingDeliveryDetails.ts
│   │   │   ├── GLCodeThirdParty.ts
│   │   │   └── ConfirmBooking.ts
│   │   │
│   │   └── api/                        ← API Tasks (HTTP requests)
│   │       └── GetTodo.ts              ← Task.where() — GET /todos/{id}
│   │
│   ├── questions/
│   │   ├── ui/                         ← UI Questions (DOM/page queries)
│   │   │   ├── AvailableRates.ts       ← Returns list of rate price strings
│   │   │   ├── PageTitle.ts            ← Returns page title via Page.current().title()
│   │   │   ├── TermsExist.ts           ← Checks Terms heading visibility
│   │   │   └── IsQuoteBookable.ts      ← Pure data — derives bookability from TestData (no UI)
│   │   │
│   │   └── api/                        ← API Questions (response queries)
│   │       └── TodoResponse.ts         ← Question.about() — reads fields from LastResponse.body()
│   │
│   ├── interactions/                   ← Low-level primitives (always UI)
│   │   ├── FillZipAuto.ts              ← ZIP autocomplete: type → wait listbox → ArrowDown + Enter
│   │   └── ConfirmBookingModal.ts      ← Retry open modal (UI bug: 1-3 clicks needed)
│   │
│   ├── userinterfaces/                 ← Page Objects (locators only, no logic — always UI)
│   │   ├── LoginPage.ts
│   │   ├── HomePage.ts
│   │   ├── QuotingPage.ts
│   │   └── BookingPage.ts
│   │
│   ├── models/
│   │   ├── TestData.ts                 ← Interface for Excel row (CaseID → C5_Stackable)
│   │   └── Shipwell_TestCases.xlsx     ← Excel test data (sheet: 'LTL')
│   │
│   └── utils/
│       ├── excelReader.ts              ← ExcelReader.readExcel() + getRowByCaseId() with cache
│       ├── commodityHelper.ts          ← getCommodities(data): filters C1-C5 where Qty > 0
│       └── quote.json                  ← Static quote data (origin: 70001, dest: 60608)
│
├── runners/
│   ├── executeallbrowsers.ts           ← Orchestrator: runs API once, then UI per browser
│   └── utils.ts                        ← clean(), runApiTests(), runTestsByTag(), generateConsolidatedReport()
│
├── interfaces/
│   ├── SerenityTag.ts
│   └── SerenityTestResult.ts
│
├── .env                                ← USER_EMAIL, USER_PASSWORD, BASE_URL, API_BASE_URL
├── cucumber.yaml                       ← Cucumber config (require paths, format)
├── tsconfig.json
└── package.json
```

---

## Screenplay Pattern — How This Project Uses It

### Actors

Defined in `support/Actors.ts`. Single Cast — every actor gets:

```typescript
BrowseTheWebWithPlaywright.using(browser, contextOptions, extraOptions);
CallAnApi.at(process.env.API_BASE_URL ?? browserContextOptions.baseURL!);
TakeNotes.usingAnEmptyNotepad();
```

In API mode (`RUN_MODE=api`), `serenity.config.ts` uses `Cast.where()` instead — no browser launched:

```typescript
Cast.where(actor =>
  actor.whoCan(
    CallAnApi.at(process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com'),
    TakeNotes.usingAnEmptyNotepad(),
  ),
);
```

Actor initialized in `serenity.config.ts`:

```typescript
Before(() => {
  actorCalled('User');
});
```

### Tasks

Extend `Task`, implement `performAs(actor)`. Created via static factory method.

**UI Tasks** (`src/tasks/ui/`):

| File                            | Factory                                 | Purpose                                          |
| ------------------------------- | --------------------------------------- | ------------------------------------------------ |
| `OpenSite.ts`                   | `OpenSite.at(url)`                      | Navigate to URL                                  |
| `PerformLogin.ts`               | `PerformLogin.with(email?, pass?)`      | Login — falls back to env vars                   |
| `OpenQuoting.ts`                | `OpenQuoting.LTL()`                     | Navigate to Quoting → LTL                        |
| `FillQuote.ts`                  | `FillQuote.LTL()`                       | Fill static quote from quote.json                |
| `FillDynamicQuote.ts`           | `FillDynamicQuote.ltl(testData)`        | Fill quote from Excel TestData                   |
| `SelectRandomRate.ts`           | `SelectRandomRate.andBook(isBookable)`  | Pick random rate, click Book                     |
| `FillBookingPickUpDetails.ts`   | `FillBookingPickUpDetails.with(data)`   | Fill pickup section                              |
| `FillBookingDeliveryDetails.ts` | `FillBookingDeliveryDetails.with(data)` | Fill delivery section                            |
| `GLCodeThirdParty.ts`           | `GLCodeThirdParty.with(data)`           | Fill GL codes section                            |
| `ConfirmBooking.ts`             | `ConfirmBooking.now()`                  | Confirm booking (uses ConfirmBookingModal retry) |

**API Tasks** (`src/tasks/api/`) — use `Task.where()` factory:

| File         | Factory              | Purpose                                |
| ------------ | -------------------- | -------------------------------------- |
| `GetTodo.ts` | `GetTodo.withId(id)` | `Send.a(GetRequest.to('/todos/{id}'))` |

### Questions

**UI Questions** (`src/questions/ui/`) — extend `Question<Promise<T>>` (async, browser-dependent):

| File                 | Returns             | Notes                                          |
| -------------------- | ------------------- | ---------------------------------------------- |
| `AvailableRates.ts`  | `Promise<string[]>` | Rate price strings                             |
| `PageTitle.ts`       | `Promise<string>`   | `Page.current().title()`                       |
| `TermsExist.ts`      | `Promise<boolean>`  | Terms heading visibility                       |
| `IsQuoteBookable.ts` | `boolean`           | Pure data — no UI, extends `Question<boolean>` |

**API Questions** (`src/questions/api/`) — use `Question.about()` factory (preferred v3 pattern):

| File              | Factory                 | Purpose                                        |
| ----------------- | ----------------------- | ---------------------------------------------- |
| `TodoResponse.ts` | `TodoResponse.userId()` | Reads `body.userId` from `LastResponse.body()` |

### Interactions

| File                     | Factory                                 | Purpose                                                      |
| ------------------------ | --------------------------------------- | ------------------------------------------------------------ |
| `FillZipAuto.ts`         | `FillZipAuto.with(input, listbox, zip)` | Type ZIP → wait autocomplete → ArrowDown + Enter             |
| `ConfirmBookingModal.ts` | `ConfirmBookingModal.open()`            | Retry click confirm button up to 3 times (UI bug workaround) |

### UserInterfaces (Page Objects)

Pure locator classes — **no logic, no actions**.

| File             | Key Locators                                                                                                                                                          |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LoginPage.ts`   | EmailField, PasswordField, LoginButton                                                                                                                                |
| `HomePage.ts`    | Menu, QuotingOption, QuotingLTL, Terms                                                                                                                                |
| `QuotingPage.ts` | OriginZIP, DestinationZIP, listboxes, ItemName/Width/Height/Length/Weight/Volume inputs, AddItemButton, GetBestRatesButton, PriceRates, rates, infoButton, bookButton |
| `BookingPage.ts` | Pickup section, Delivery section, GL Code section, confirmBookingButton, bookingConfirmedTitle                                                                        |

---

## API Automation

### Pattern

```
features/api/{domain}/
  {domain}.feature       ← @api tag
  {domain}.steps.ts

src/tasks/api/
  {Action}.ts            ← Task.where() with Send.a(GetRequest/PostRequest/...)

src/questions/api/
  {Domain}Response.ts    ← Question.about() reading from LastResponse
```

### Template — todos.feature

```gherkin
@api @regression
Feature: TODO API validation
  Scenario: GET todo by ID returns the expected user
    Given the actor calls the API
    When the actor requests TODO with id 1
    Then the response status should be 200
    And the userId should be 1
```

### Task pattern (API)

```typescript
export class GetTodo {
  static withId(id: number) {
    return Task.where(`#actor requests TODO with id ${id}`, Send.a(GetRequest.to(`/todos/${id}`)));
  }
}
```

### Question pattern (API)

```typescript
export class TodoResponse {
  static userId() {
    return Question.about('response userId', actor =>
      actor.answer(LastResponse.body<{ userId: number }>()).then(body => body.userId),
    );
  }
}
```

### Step pattern (API)

```typescript
Given('the actor calls the API', () => {
  actorCalled('API Actor'); // cast gives it CallAnApi from API_BASE_URL
});

When('the actor requests TODO with id {int}', async (id: number) => {
  await actorInTheSpotlight().attemptsTo(GetTodo.withId(id));
});

Then('the response status should be {int}', async (expectedStatus: number) => {
  await actorInTheSpotlight().attemptsTo(Ensure.that(LastResponse.status(), equals(expectedStatus)));
});
```

---

## Runner — API runs once, UI runs per browser

`runners/executeallbrowsers.ts` orchestrates:

1. **`runApiTests(tag?)`** — runs `features/api/**` once, no browser, `RUN_MODE=api`, output → `target/site/serenity/api`
2. **`runTestsByTag(tag, browser)`** — runs `features/ui/**` per browser, output → `target/site/serenity/{browser}`
3. **`generateConsolidatedReport(['api', ...browsers])`** — merges all results including API

`serenity.config.ts` detects `RUN_MODE=api` and skips browser launch, configuring a lightweight `Cast.where()` actor.

---

## Configuration

### `cucumber.yaml`

```yaml
default:
  requireModule:
    - ts-node/register
  format:
    - '@serenity-js/cucumber'
  require:
    - ./features/**/*.steps.ts
    - ./support/**/*.config.ts
```

### `.env`

```
USER_EMAIL="primo-it@heyprimo.com"
USER_PASSWORD="Test1234#"
BASE_URL="https://portal.primofabric.com"
API_BASE_URL="https://jsonplaceholder.typicode.com"
```

### `serenity.config.ts` — timeouts

- Cucumber step: 120s
- Playwright default: 5s / navigation: 10s
- Serenity cue: 5s

---

## Running Tests

```bash
# All: API once + UI on chromium + webkit, consolidates report
npm test

# Single browser (UI only, via cucumber.yaml)
npm run test:chromium
npm run test:webkit

# With tag filter and specific browsers
npx ts-node runners/executeallbrowsers.ts tag=@smoke browsers=chromium

# Generate HTML report
npm run test:report

# Serve report
npm start   # http://localhost:8080
```

---

## Naming Conventions

| Layer          | Convention                 | Example                                       |
| -------------- | -------------------------- | --------------------------------------------- |
| Tasks          | PascalCase verb + noun     | `PerformLogin`, `FillDynamicQuote`, `GetTodo` |
| Questions      | PascalCase noun phrase     | `AvailableRates`, `PageTitle`, `TodoResponse` |
| Interactions   | PascalCase verb phrase     | `FillZipAuto`, `ConfirmBookingModal`          |
| UserInterfaces | PascalCase + `Page` suffix | `LoginPage`, `QuotingPage`                    |
| Step files     | `{domain}.steps.ts`        | `login.steps.ts`, `todos.steps.ts`            |
| Feature files  | `{domain}.feature`         | `booking.feature`, `todos.feature`            |
| Tags           | lowercase `@tag`           | `@smoke`, `@regression`, `@api`, `@ui`        |

---

## Active Test Flows

| Tag                | Feature                                | Type | Status           |
| ------------------ | -------------------------------------- | ---- | ---------------- |
| `@login`           | Login with static credentials          | UI   | Working          |
| `@logterms`        | Login parameterized (Scenario Outline) | UI   | Working          |
| `@smoke @quoting`  | LTL quote creation (static data)       | UI   | Working          |
| `@shipwell`        | LTL quote via Excel + full booking     | UI   | Working          |
| `@api @regression` | GET /todos/{id} validation             | API  | Template — ready |

---

## Pending Coverage

- Drayage quoting flow
- FTL-specific scenarios
- PDF validation: BOL, Shipping Label, Rate PDF
- PRIMUS / SAP integration tests
- Negative scenarios and edge cases
- Tags `@regression` and `@integration` (UI) not yet implemented
- Real PRIMO API tests (auth, quoting, booking endpoints)

---

## Screenplay Rules (Strict)

1. **No procedural code** — everything goes through `actor.attemptsTo()`
2. **No hardcoded waits** — use `Wait.until()` with conditions; `Wait.for()` only when unavoidable
3. **Tasks call Tasks or Interactions** — never raw Playwright API
4. **Questions only read** — no state mutation inside a Question
5. **UserInterfaces are pure locators** — no actions, no waits, no logic
6. **notes()** — only for passing data between steps that cannot be passed as parameters
7. **API Tasks** use `Task.where()` factory; **API Questions** use `Question.about()` factory
8. **UI Questions** extend `Question<Promise<T>>` (async); pure data Questions use `Question<T>` (sync)
