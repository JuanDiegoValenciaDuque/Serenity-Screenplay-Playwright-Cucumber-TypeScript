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
| `form-data`                 | —       | Multipart/form-data for booking endpoint          |
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
│   │   │   ├── booking.feature         ← @BookingUI — full UI booking flow via Excel
│   │   │   ├── excel.steps.ts          ← Shared Excel steps (also stores testData in Serenity notes)
│   │   │   └── newbooking.steps.ts
│   │   └── quoting/
│   │       ├── quoting.feature         ← @smoke @quoting — LTL quote via Excel
│   │       └── quoting.steps.ts
│   │
│   └── api/                            ← API (no browser) test scenarios
│       ├── templateAPI/
│       │   ├── todos.feature           ← @api @regression — GET /todos/{id}
│       │   └── todos.steps.ts
│       └── booking/
│           ├── booking.feature         ← @api @primo — full PRIMO LTL booking flow
│           └── booking.steps.ts
│
├── support/
│   ├── Actors.ts                       ← Cast implementation
│   └── serenity.config.ts              ← BeforeAll/AfterAll, browser launch, Serenity configure()
│
├── src/
│   ├── tasks/
│   │   ├── ui/
│   │   │   ├── OpenSite.ts
│   │   │   ├── PerformLogin.ts
│   │   │   ├── OpenQuoting.ts
│   │   │   ├── FillQuote.ts            ← Static quote (from quote.json)
│   │   │   ├── FillDynamicQuote.ts     ← Dynamic quote from Excel; scrolls to ItemNameInput before fill
│   │   │   ├── SelectRandomRate.ts
│   │   │   ├── FillBookingPickUpDetails.ts
│   │   │   ├── FillBookingDeliveryDetails.ts
│   │   │   ├── GLCodeThirdParty.ts
│   │   │   └── ConfirmBooking.ts
│   │   │
│   │   └── api/
│   │       ├── GetTodo.ts
│   │       ├── ObtainToken.ts          ← client_credentials via CLIENTE_ID/CLIENTE_SECRET env vars
│   │       ├── ResolveZipCode.ts       ← Calls address-search for origin+destination; stores in enrichedData notes
│   │       ├── ResolveDensity.ts       ← Calls density endpoint per commodity; stores volume/class/density in enrichedData notes
│   │       ├── CreateQuote.ts          ← Builds body via QuoteRequestBuilder(testData+enrichedData); logs full response
│   │       └── BookShipment.ts         ← Builds FormData via BookRequestBuilder(testData+enrichedData); uses BEARER_TOKEN env var
│   │
│   ├── questions/
│   │   ├── ui/
│   │   │   ├── AvailableRates.ts
│   │   │   ├── PageTitle.ts
│   │   │   ├── TermsExist.ts
│   │   │   └── IsQuoteBookable.ts
│   │   └── api/
│   │       ├── TodoResponse.ts
│   │       ├── QuoteResponse.ts
│   │       └── BookingResponse.ts
│   │
│   ├── interactions/
│   │   ├── FillZipAuto.ts
│   │   └── ConfirmBookingModal.ts
│   │
│   ├── userinterfaces/
│   │   ├── LoginPage.ts
│   │   ├── HomePage.ts
│   │   ├── QuotingPage.ts
│   │   └── BookingPage.ts
│   │
│   ├── models/
│   │   ├── TestData.ts                 ← Excel row interface: CaseID→C5_Levels + window times (no C_Volume — comes from API)
│   │   ├── EnrichedData.ts             ← API-derived data: city/state per zip + CommodityEnrichment[] (volume/density/class)
│   │   ├── PrimoNotes.ts               ← { bearerToken, quoteNumber, selectedCarrier, orderNumber, testData, enrichedData }
│   │   ├── api/
│   │   │   ├── QuoteRequestBuilder.ts  ← QuoteRequestBuilder.from(testData, enrichedData) → quote body
│   │   │   └── BookRequestBuilder.ts   ← BookRequestBuilder.formDataFrom(testData, enrichedData, quoteNumber, selectedCarrier) → FormData
│   │   └── Shipwell_TestCases_filtered.xlsx  ← Excel test data (sheet: 'LTL')
│   │
│   └── utils/
│       ├── excelReader.ts              ← readExcel() with cache + getRowByCaseId() supporting 'Random'
│       ├── commodityHelper.ts          ← getCommodities(data): filters C1-C5 where Qty > 0
│       └── quote.json                  ← Static quote data
│
├── runners/
│   ├── executeallbrowsers.ts
│   └── utils.ts
│
├── interfaces/
│   ├── SerenityTag.ts
│   └── SerenityTestResult.ts
│
├── .vscode/
│   └── settings.json                   ← Cucumber language server config (glue paths for cucumber.cucumber-official)
├── .env
├── cucumber.yaml
├── tsconfig.json
└── package.json
```

> **Note:** A `.vscode/settings.json` also exists at the **parent `Automation/`** level with paths prefixed by `Serenity-Screenplay-Playwright-Cucumber-TypeScript/` — this is needed when VS Code is opened at the parent folder (which is the Claude Code working directory).

---

## Screenplay Pattern — How This Project Uses It

### Actors

Defined in `support/Actors.ts`. In API mode (`RUN_MODE=api`), `serenity.config.ts` uses `Cast.where()` — no browser:

```typescript
Cast.where(actor =>
  actor.whoCan(
    CallAnApi.at(process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com'),
    TakeNotes.usingAnEmptyNotepad(),
  ),
);
```

**Critical:** `serenity.config.ts` has a `Before` hook that calls `actorCalled('User')` before **every** scenario — this makes `'User'` the actor in the spotlight at scenario start. PRIMO API steps then call `actorCalled('PRIMO Actor')`, which creates a new actor with its own **empty** notepad. If Excel loading steps run before this (`actorInTheSpotlight()` still pointing to `'User'`), `testData` lands in the wrong notepad and the API steps throw `Note of 'testData' cannot be retrieved`. **Fix:** always configure the PRIMO actor (`Given the actor is configured to call PRIMO APIs`) as the first step, before any Excel/notes steps.

### Tasks

**UI Tasks** (`src/tasks/ui/`):

| File                            | Factory                                 | Purpose                                         |
| ------------------------------- | --------------------------------------- | ----------------------------------------------- |
| `OpenSite.ts`                   | `OpenSite.at(url)`                      | Navigate to URL                                  |
| `PerformLogin.ts`               | `PerformLogin.with(email?, pass?)`      | Login — falls back to env vars                   |
| `OpenQuoting.ts`                | `OpenQuoting.LTL()`                     | Navigate to Quoting → LTL                        |
| `FillQuote.ts`                  | `FillQuote.LTL()`                       | Fill static quote from quote.json                |
| `FillDynamicQuote.ts`           | `FillDynamicQuote.ltl(testData)`        | Fill quote from Excel; `ExecuteScript.sync` scrolls to ItemNameInput before filling |
| `SelectRandomRate.ts`           | `SelectRandomRate.andBook(isBookable)`  | Pick random rate, click Book                     |
| `FillBookingPickUpDetails.ts`   | `FillBookingPickUpDetails.with(data)`   | Fill pickup section                              |
| `FillBookingDeliveryDetails.ts` | `FillBookingDeliveryDetails.with(data)` | Fill delivery section                            |
| `GLCodeThirdParty.ts`           | `GLCodeThirdParty.with(data)`           | Fill GL codes section                            |
| `ConfirmBooking.ts`             | `ConfirmBooking.now()`                  | Confirm booking                                  |

**API Tasks** (`src/tasks/api/`):

| File                | Factory                                    | Endpoint                                          | Token used       |
| ------------------- | ------------------------------------------ | ------------------------------------------------- | ---------------- |
| `ObtainToken.ts`    | `ObtainToken.forPrimoApi()`                | `POST identity.primofabric.com/connect/token`     | none (obtains it)|
| `ResolveZipCode.ts` | `ResolveZipCode.forOriginAndDestination()` | `POST api.primofabric.com/portal/v1/address-search` | `BEARER_TOKEN`  |
| `ResolveDensity.ts` | `ResolveDensity.forAllCommodities()`       | `POST api.primofabric.com/rating/v1/density`      | `BEARER_TOKEN`  |
| `CreateQuote.ts`    | `CreateQuote.forLtl()`                     | `POST api.primofabric.com/portal/v2/quote`        | `bearerToken` (notes) |
| `BookShipment.ts`   | `BookShipment.withQuoteData()`             | `POST api.primofabric.com/portal/v1/book`         | `BEARER_TOKEN`  |

### Models

**`TestData`** — mirrors Excel columns (sheet `LTL`):
- Origin/destination: `OriginZip`, `DestinationZip`, `OriginCompany`, `OriginAddress1/2`, `DeliveryAddress1/2`
- Contacts: `PickupContact/Phone/Email/Ref`, `DeliveryContact/Phone/Email/Ref`
- References: `ThirdPartyReference`, `AdditionalReference`, `ReferenceNumber`, `SelectedRate`
- Commodities: `C1_Qty/Name/Package/Length/Width/Height/Weight/Hazmat/NMFC/Stackable/Levels` … up to C5
- Timing: `PickupWindowFrom`, `PickupWindowTo`, `DeliveryWindowFrom`, `DeliveryWindowTo`
- Accessorials: `Accessorial1`…`Accessorial4`
- **No `C_Volume` or `C_FreightClass`** — these come from the density API

**`EnrichedData`** — API-derived, stored in `notes<PrimoNotes>().get('enrichedData')`:
```typescript
interface CommodityEnrichment { volume: number; density: number; freightClass: string; }
interface EnrichedData {
  originCity: string; originState: string;
  destinationCity: string; destinationState: string;
  commodityDetails: CommodityEnrichment[];
}
```

**`PrimoNotes`**:
```typescript
interface PrimoNotes {
  bearerToken: string;       // machine token from client_credentials
  quoteNumber: number;
  selectedCarrier: number;
  orderNumber: number;
  testData: TestData;        // loaded from Excel
  enrichedData: EnrichedData; // populated by ResolveZipCode + ResolveDensity
}
```

### Questions

**API Questions** (`src/questions/api/`):

| File                | Key methods                                     |
| ------------------- | ----------------------------------------------- |
| `QuoteResponse.ts`  | `quoteNumber()`, `firstCarrierRateNumber()`      |
| `BookingResponse.ts`| `orderNumber()`, `bolNumber()`                  |
| `TodoResponse.ts`   | `userId()`                                      |

---

## API Automation — PRIMO Full Flow

### Token Strategy (Dual Token)

| Token         | Source                        | Grant               | Used for                           |
| ------------- | ----------------------------- | ------------------- | ---------------------------------- |
| `bearerToken` | `ObtainToken` → notes         | `client_credentials`| Quote (`CreateQuote`)              |
| `BEARER_TOKEN`| `.env` (user JWT, hardcoded)  | user session token  | Zip lookup, Density, Booking       |

The quote endpoint accepts the machine token. All other portal endpoints require a user-level token with `customer_number` and `email` claims, which `client_credentials` does not provide.

### Full API Booking Flow

```gherkin
Given the actor is configured to call PRIMO APIs          ← actorCalled('PRIMO Actor')
And I load the Excel file from "src/models/Shipwell_TestCases_filtered.xlsx"
And I get test data for "<CaseID>"                        ← stored in notes.testData
When the actor obtains a PRIMO API bearer token           ← stored in notes.bearerToken
And the actor resolves city and state for origin and destination  ← 2x address-search → notes.enrichedData
And the actor resolves density and class for each commodity       ← Nx density → notes.enrichedData
And the actor creates an LTL quote from Boston MA to Cleveland OH ← QuoteRequestBuilder → notes.quoteNumber + selectedCarrier
And the actor books the first carrier from the quote             ← BookRequestBuilder → FormData
```

### Endpoints

| Endpoint                                        | Method | Body format              | Auth              |
| ----------------------------------------------- | ------ | ------------------------ | ----------------- |
| `identity.primofabric.com/connect/token`        | POST   | `application/x-www-form-urlencoded` | none   |
| `api.primofabric.com/portal/v1/address-search`  | POST   | JSON `{ searchValue, country }` | Bearer BEARER_TOKEN |
| `api.primofabric.com/rating/v1/density`         | POST   | JSON `{ Length, Width, Height, Weight, Volume:0, UOM }` | Bearer BEARER_TOKEN |
| `api.primofabric.com/portal/v2/quote`           | POST   | JSON                     | Bearer bearerToken (notes) |
| `api.primofabric.com/portal/v1/book`            | POST   | `multipart/form-data`    | Bearer BEARER_TOKEN |

### Builders

`QuoteRequestBuilder.from(testData, enrichedData)` and `BookRequestBuilder.formDataFrom(testData, enrichedData, quoteNumber, selectedCarrier)` live in `src/models/api/` and centralise all request construction. Tasks have no inline data.

Package type mapping: `'Pallet' → 100`, `'Box' → 200`, `'Crate' → 300`, `'Bundle' → 400`, `'Drum' → 500`.

### Booking Form-Data Structure

`BookRequestBuilder.formDataFrom()` logs the full payload to console before building the `FormData`. Shape reference (all fields sent as multipart parts, `movement` and nested objects serialized as JSON strings):

```json
{
  "customerNumber": "1235100202",
  "customerBsn": "1237100099",
  "bookDate": "<ISO timestamp>",
  "bolInstructions": "",
  "bolRemarks": "",
  "freightDirection": "Outbound",
  "isInsured": false,
  "referenceNumbers": [
    { "name": "Ref #", "value": "<ThirdPartyReference>", "showOnBol": true },
    { "name": "Reference# name", "value": "<AdditionalReference>", "showOnBol": true }
  ],
  "thirdParty": {
    "referenceNumber": "<ThirdPartyReference>",
    "additionalReference": "<AdditionalReference>",
    "additionalReferenceName": "Reference# name"
  },
  "brokerInformation": { "brokerName": null, "brokerPhone": null, "brokerContactName": null, "brokerInstructions": null },
  "notificationEmails": "<PickupEmail>",
  "movement": {
    "quote": {
      "lfsQuoteNumber": "<quoteNumber>",
      "selectedCarrier": "<selectedCarrier>",
      "leastCostReason": null,
      "equipmentType": null,
      "serviceType": null,
      "equipmentLength": null,
      "UOM": "US"
    },
    "estimatedDistanceInMiles": 0,
    "estimatedPickupDate": "<now + 2 days ISO>",
    "estimatedDeliveryDate": "<now + 4 days ISO>",
    "commodities": [{
      "description": "<C1_Name>",
      "freightClass": "<enriched.freightClass>",
      "suggestedClass": "<enriched.freightClass>",
      "packageType": 100,
      "quantity": "<C1_Qty>",
      "numberOfPieces": null,
      "pieceType": null,
      "length": "<C1_Length>",
      "width": "<C1_Width>",
      "height": "<C1_Height>",
      "weight": "<C1_Weight>",
      "density": "<enriched.density>",
      "nmfc": "<C1_NMFC>",
      "isHazardous": false,
      "isStackable": true,
      "levels": "<C1_Levels>",
      "hazardousMaterial": null
    }],
    "hazardousContact": null,
    "pickupAddress": {
      "name": "<OriginCompany>", "address1": "<OriginAddress1>", "address2": "<OriginAddress2>",
      "city": "<enriched.originCity>", "state": "<enriched.originState>",
      "postalCode": "<OriginZip>", "country": "US", "customerBsn": null
    },
    "deliveryAddress": {
      "name": "<DestinationCompany>", "address1": "<DeliveryAddress1>", "address2": "<DeliveryAddress2>",
      "city": "<enriched.destinationCity>", "state": "<enriched.destinationState>",
      "postalCode": "<DestinationZip>", "country": "US", "customerBsn": null
    },
    "stopAddress": null,
    "pickupInformation": {
      "instructions": "",
      "referenceNumber": "<PickupRef>",
      "contact": { "name": "<PickupContact>", "phone": "<PickupPhone>", "phonePrefix": "+1", "email": "<PickupEmail>" },
      "shippingWindowTimeFrom": "<PickupWindowFrom>",
      "shippingWindowTimeTo": "<PickupWindowTo>"
    },
    "deliveryInformation": {
      "instructions": "",
      "referenceNumber": "<DeliveryRef>",
      "contact": { "name": "<DeliveryContact>", "phone": "<DeliveryPhone>", "phonePrefix": "+1", "email": "<DeliveryEmail>" },
      "shippingWindowTimeFrom": "<DeliveryWindowFrom>",
      "shippingWindowTimeTo": "<DeliveryWindowTo>"
    }
  }
}
```

**Hardcoded values to update before production:** `customerNumber: '1235100202'` and `customerBsn: '1237100099'` — these should come from env vars or TestData when multi-tenant support is needed.

### API Response Shapes

**`POST /portal/v1/address-search`** — body `{ searchValue: "70001", country: "US" }`:
```json
{
  "data": [{
    "companyName": null,
    "displayName": "METAIRIE, LA 70001 US",
    "address1": null,
    "city": "METAIRIE",
    "state": "LA",
    "postalCode": "70001",
    "country": "US"
  }],
  "errors": null
}
```
Code reads `body.data[0].city` and `body.data[0].state`. Throws if `body.data` is null/empty.

**`POST /rating/v1/density`** — body `{ Length, Width, Height, Weight, Volume: 0, UOM: "in" }`:
```json
{
  "data": {
    "totalCube": 52.73,
    "totalWeight": 670,
    "totalDensity": 12.71,
    "freightClass": "85",
    "cbm": 1.4933
  },
  "errors": null
}
```
`totalCube` = **Volume** (stored as `volume` in `CommodityEnrichment`). Code reads `data.totalCube`, `data.totalDensity`, `data.freightClass`.

---

## Utility Helpers

### `getCommodities(data: TestData)`

Location: `src/utils/commodityHelper.ts`. Iterates C1–C5 slots, skips any where `C${n}_Qty` is falsy or 0, returns an array:

```typescript
{ name: string, length: number, width: number, height: number, weight: number, volume: number }
```

**Important:** `volume` is always `0` in this output — `C${n}_Volume` does not exist in `TestData` (field was removed; volume comes from the density API). The UI flow uses `volume` only to populate `VolumeInputs` on the quoting form when dimensions are zero. The API flow reads volume from `enrichedData.commodityDetails[i].volume` (set by `ResolveDensity`), not from this helper.

---

## Excel Data Loading

`ExcelReader` in `src/utils/excelReader.ts`:
- Reads and caches the Excel file (sheet `LTL`)
- `getRowByCaseId(data, 'TC-001')` — finds row by exact CaseID
- `getRowByCaseId(data, 'Random')` — returns a random row

`excel.steps.ts` (shared across UI and API features):
```typescript
Given('I load the Excel file from {string}', function (filePath) {
  this.excelData = ExcelReader.readExcel(filePath);
});

Given('I get test data for {string}', async function (caseId) {
  const testData = ExcelReader.getRowByCaseId(this.excelData, caseId);
  this.testData = testData;                                    // Cucumber World (UI)
  await actorInTheSpotlight().attemptsTo(
    notes<PrimoNotes>().set('testData', testData),            // Serenity notes (API)
  );
});
```

---

## Key Screenplay Patterns

### Nested task calls inside `Interaction.where()`

Inside `Interaction.where()`, the actor is typed as `UsesAbilities & AnswersQuestions & CollectsArtifacts` — **no `attemptsTo()`**. Use `.performAs(actor)` directly (it is what `attemptsTo` calls internally):

```typescript
Interaction.where('#actor does X', async actor => {
  await Send.a(PostRequest.to(URL).with(body).using(config)).performAs(actor);
  const body = await actor.answer(LastResponse.body<T>());
  await notes<PrimoNotes>().set('key', value).performAs(actor);
})
```

### Sequential API calls with eager value binding

When making multiple API calls inside one `Interaction.where()`, use `.performAs(actor)` for each `Send.a()` and read `LastResponse` immediately after each call (before the next overwrites it):

```typescript
await Send.a(PostRequest.to(URL1).with(body1).using(auth)).performAs(actor);
const result1 = await actor.answer(LastResponse.body<T>());  // read immediately

await Send.a(PostRequest.to(URL2).with(body2).using(auth)).performAs(actor);
const result2 = await actor.answer(LastResponse.body<T>());  // reads URL2 response
```

### Error handling in API tasks

Always add `validateStatus: () => true` + response logging when debugging, and guard against `data: null` responses:

```typescript
if (!body.data) {
  throw new Error(`Request failed (${status}): ${JSON.stringify(body.errors)}`);
}
```

---

## Feature File Pattern

All data-driven features use `Scenario Outline` + `Examples`. The actor must be configured **before** loading Excel data so `actorInTheSpotlight()` points to the right notepad:

```gherkin
# API feature — actor first, then Excel
Scenario Outline: ...
  Given the actor is configured to call PRIMO APIs
  And I load the Excel file from "src/models/Shipwell_TestCases_filtered.xlsx"
  And I get test data for "<CaseID>"
  ...
  Examples:
    | CaseID |
    | TC-001 |
    | Random |

# UI feature — Background handles actor, Excel in Scenario
Background:
  Given the user opens the Portal site
  When the user logs in with credentials

Scenario Outline: ...
  Given I load the Excel file from "src/models/Shipwell_TestCases_filtered.xlsx"
  And I get test data for "<CaseID>"
  ...
```

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
HEADLESS=true
CLIENTE_ID="portal-api-client"
CLIENTE_SECRET="<secret>"
BEARER_TOKEN="<user-level JWT for zip/density/booking endpoints>"
```

`BEARER_TOKEN` is a manually obtained user-level JWT. It needs to be refreshed when it expires. It is required for: address-search, density, and booking endpoints (all require user claims: `customer_number`, `email`).

### VS Code — Cucumber Extension

`.vscode/settings.json` exists at **both levels**:

- `Serenity-Screenplay-Playwright-Cucumber-TypeScript/.vscode/settings.json` — for when that folder is the VS Code root
- `Automation/.vscode/settings.json` — for when the parent folder is the VS Code root (Claude Code working directory)

Both configure `cucumber.cucumber-official` extension with the correct glue paths. After changing settings, run `Ctrl+Shift+P` → **Restart Extension Host**.

---

## Running Tests

### `npm test` — Main runner (`runners/executeallbrowsers.ts`)

Always runs **API tests first** (once, no browser), then **UI tests** on each specified browser.

**Arguments:**

| Argument | Format | Default | Description |
|----------|--------|---------|-------------|
| `tag=` | `@tag` or `@tag1,@tag2` | none (all scenarios) | Cucumber tag expression. Multiple tags joined with `or` internally |
| `browsers=` | `chromium`, `webkit`, or both comma-separated | `chromium,webkit` | Browsers for UI tests only |

```bash
# All tests: API + UI on chromium and webkit (no tag filter)
npm test

# Tag filter — API + UI on chromium and webkit
npm test -- tag="@login"
npm test -- tag="@api"
npm test -- tag="@api @primo"

# Multiple tags — joined with OR internally
npm test -- tag="@api,@login"
# equivalent to: --tags "@api or @login"

# Tag filter + single browser
npm test -- tag="@login" browsers="webkit"
npm test -- tag="@login" browsers="chromium"

# Tag filter + multiple browsers (explicit)
npm test -- tag="@api,@login" browsers="chromium,webkit"

# No tag filter, single browser
npm test -- browsers="webkit"
npm test -- browsers="chromium"
```

> **Note:** API tests (`features/api/`) always run regardless of the `browsers=` argument. The `browsers=` argument only affects UI tests (`features/ui/`).

### Direct scripts (UI only, no consolidated report)

```bash
# UI on chromium only — no tag filter
npm run test:chromium

# UI on webkit only — no tag filter
npm run test:webkit
```

### Report

```bash
# Generate consolidated HTML report (run after npm test)
npm run test:report

# Serve report at http://localhost:8080
npm start
```

---

## Naming Conventions

| Layer          | Convention                 | Example                                         |
| -------------- | -------------------------- | ----------------------------------------------- |
| Tasks          | PascalCase verb + noun     | `PerformLogin`, `FillDynamicQuote`, `ResolveZipCode` |
| Questions      | PascalCase noun phrase     | `AvailableRates`, `BookingResponse`             |
| Interactions   | PascalCase verb phrase     | `FillZipAuto`, `ConfirmBookingModal`            |
| UserInterfaces | PascalCase + `Page` suffix | `LoginPage`, `QuotingPage`                      |
| Builders       | PascalCase + `Builder`     | `QuoteRequestBuilder`, `BookRequestBuilder`     |
| Step files     | `{domain}.steps.ts`        | `booking.steps.ts`, `excel.steps.ts`           |
| Feature files  | `{domain}.feature`         | `booking.feature`                               |
| Tags           | lowercase `@tag`           | `@smoke`, `@api`, `@primo`, `@BookingUI`        |

---

## Active Test Flows

| Tag                | Feature                                         | Type | Status  |
| ------------------ | ----------------------------------------------- | ---- | ------- |
| `@login`           | Login with static credentials                   | UI   | Working |
| `@logterms`        | Login parameterized (Scenario Outline)          | UI   | Working |
| `@smoke @quoting`  | LTL quote via Excel data                        | UI   | Working |
| `@BookingUI`       | LTL full booking via Excel (quote + book)       | UI   | Working |
| `@api @regression` | GET /todos/{id} validation                      | API  | Working |
| `@api @primo`      | Auth → Zip → Density → Quote → Book (via Excel) | API  | Working |

---

## Pending Coverage

- Drayage and FTL quoting flows
- PDF validation: BOL, Shipping Label, Rate PDF
- PRIMUS / SAP integration tests
- Negative scenarios and edge cases
- `BEARER_TOKEN` refresh automation (currently manual)
- Accessorials mapping in builders
- `password` grant or dedicated test client for ObtainToken (current `client_credentials` token lacks user claims)
