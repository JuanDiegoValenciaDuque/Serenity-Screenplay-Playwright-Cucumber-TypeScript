Feature: As a user, I want to create an LTL quote so that I can obtain pricing and shipping details for LTL shipments.

  Background:
    Given the user opens the Portal site
    When the user logs in with credentials

  Scenario: Create LTL quote
    Given the user wants to create a new LTL quote
    When the user fills in all the required information
    And the system retrieves the best available rates
    Then the user can see all the rates displayed successfully
