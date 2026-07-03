@api @primo
Feature: PRIMO LTL booking via API

  Scenario Outline: Create a full LTL booking through the PRIMO API
    Given the actor is configured to call PRIMO APIs
    And I load the Excel file from "src/models/TestCasesAPI.xlsx"
    And I get test data for "<CaseID>"
    When the actor resolves city and state for origin and destination
    And the actor resolves density and class for each commodity
    And the actor resolves NMFC codes for all commodities
    And the actor resolves hazmat information for hazardous commodities
    And the actor resolves accessorials for the quote
    And the actor creates an LTL quote from origin to destination
    Then the response status should be 200
    And the response contains a valid quote number
    When the actor books the first carrier from the quote
    Then the response status should be 200
    And the response contains a BOL number
    And the response contains an order number

    Examples:
      | CaseID |
      | TC-002 |