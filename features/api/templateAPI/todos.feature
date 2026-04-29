@api @regression
Feature: TODO API validation

  Scenario: GET todo by ID returns the expected user
    Given the actor calls the API
    When the actor requests TODO with id 1
    Then the response status should be 200
    And the userId should be 1
