Feature: Login to the Portal
  Scenario: open portal.heyprimo
    Given the user opens the Portal site
    When the user logs in with credentials
    Then I should see the tittle "PRIMO"