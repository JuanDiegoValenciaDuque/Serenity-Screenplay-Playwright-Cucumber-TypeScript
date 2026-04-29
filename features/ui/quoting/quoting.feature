@smoke @quoting
Feature: LTL quote created in Portal is successfully registered in Shipwell
  As a user,
  I want an LTL quote created in Portal to be registered in Shipwell
  So that the shipment information is synchronized between systems

  Background:
    Given the user opens the Portal site
    When the user logs in with credentials

  Scenario: LTL quote is created in Shipwell
    When the user wants to create a new LTL quote
    And the user gets the best available rates
    Then the user can see all the rates displayed successfully