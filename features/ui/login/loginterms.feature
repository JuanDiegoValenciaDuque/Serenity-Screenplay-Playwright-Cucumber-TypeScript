@logterms
Feature: Login to the Portal

  Scenario Outline: open portal.heyprimo
    Given the user opens the Portal site
    When the user logs in with "<email>" and "<password>"
    Then I should see the tittle "PRIMO"
    And user read the terms

    Examples:
      | email                                         | password           |
      | andrea@a1fsinc.com                            | A1$2026            |