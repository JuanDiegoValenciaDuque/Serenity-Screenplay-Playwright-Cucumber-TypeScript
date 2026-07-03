@BookingUI
Feature: LTL quote created in Portal is successfully registered in PRIMUS
  As a user,
  I want an LTL quote created in Portal to be registered in PRIMUS
  So that the shipment information is synchronized between systems

  Background:
    Given the user opens the Portal site
    When the user logs in with credentials

  Scenario Outline: LTL quote is created in PORTAL
    Given I load the Excel file from "src/models/TestCasesAPI.xlsx"
    And I get test data for "<CaseID>"
    When the user wants to create a new LTL quote
    And the user fills booking a new LTL quote using Excel data
    Then the user can see all the rates displayed successfully
    When the users choose one rate and fills booking form
    And the user fill the booking information
    Then the bol is displayed

     Examples:
      | CaseID |
      | TC-001 |
