@login
Feature: Login to the Portal and see terms

  Scenario: open portal.heyprimo
    Given the user opens the Portal site
    When the user logs in with credentials
    Then I should see the tittle "PRIMO"