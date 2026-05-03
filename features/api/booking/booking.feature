@api @primo
Feature: PRIMO LTL booking via API

  Scenario: Create a full LTL booking through the PRIMO API
    Given the actor is configured to call PRIMO APIs
    When the actor obtains a PRIMO API bearer token
    Then the response status should be 200
    When the actor creates an LTL quote from Boston MA to Cleveland OH
    Then the response status should be 200
    And the response contains a valid quote number
    When the actor books the first carrier from the quote
    Then the response status should be 200
    And the response contains a BOL number
    And the response contains an order number
