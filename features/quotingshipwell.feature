@shipwell
Feature: LTL quote created in Portal is successfully registered in Shipwell
  As a user,
  I want an LTL quote created in Portal to be registered in Shipwell
  So that the shipment information is synchronized between systems

  Background:
    Given the user opens the Portal site
    When the user logs in with "shipwelluser@heyprimo.com" and "Welcome!2025#"
    Then I should see the tittle "PRIMO"

  Scenario Outline: LTL quote is created in Shipwell
    Given I load the Excel file from "src\models\Shipwell_TestCases.xlsx"
    And I get test data for "<CaseID>"
    When the user wants to create a new LTL quote
    And the user fills booking a new LTL quote using Excel data
    Then the user can see all the rates displayed successfully
    When the users choose one rate and fills booking form
    And the user fill the booking information
    Then the bol is displayed

    Examples:
      | CaseID |
#      | TC-241 |
      | TC-235 |
      | TC-236 |
      | TC-232 |
      | TC-233 |
      | TC-213 |
      | TC-214 |
      | TC-208 |
      | TC-178 |
      | TC-146 |
      | TC-137 |
      | TC-130 |
      | TC-112 |
      | TC-109 |
      | TC-105 |
      | TC-095 |
      | TC-088 |
      | TC-075 |
      | TC-051 |
      | TC-047 |
      | TC-039 |
      | TC-036 |
      | TC-028 |
      | TC-025 |
      | TC-021 |
      | TC-022 |
#      | TC-001 |
#      | TC-002 |
#      | TC-003 |
#      | TC-004 |
#      | TC-005 |
#      | TC-006 |
#      | TC-007 |
#      | TC-008 |
#      | TC-009 |
#      | TC-010 |
#      | TC-011 |
#      | TC-012 |
#      | TC-013 |
#      | TC-014 |
#      | TC-015 |
#      | TC-016 |
#      | TC-017 |
#      | TC-018 |
#      | TC-019 |
#      | TC-020 |
#      | TC-021 |
#      | TC-022 |
#      | TC-023 |
#      | TC-024 |
#      | TC-025 |
#      | TC-026 |
#      | TC-027 |
#      | TC-028 |
#      | TC-029 |
#      | TC-030 |
#      | TC-031 |
#      | TC-032 |
#      | TC-033 |
#      | TC-034 |
#      | TC-035 |
#      | TC-036 |
#      | TC-037 |
#      | TC-038 |
#      | TC-039 |
#      | TC-040 |
#      | TC-041 |
#      | TC-042 |
#      | TC-043 |
#      | TC-044 |
#      | TC-045 |
#      | TC-046 |
#      | TC-047 |
#      | TC-048 |
#      | TC-049 |
#      | TC-050 |
#      | TC-051 |
#      | TC-052 |
#      | TC-053 |
#      | TC-054 |
#      | TC-055 |
#      | TC-056 |
#      | TC-057 |
#      | TC-058 |
#      | TC-059 |
#      | TC-060 |
#      | TC-061 |
#      | TC-062 |
#      | TC-063 |
#      | TC-064 |
#      | TC-065 |
#      | TC-066 |
#      | TC-067 |
#      | TC-068 |
#      | TC-069 |
#      | TC-070 |
#      | TC-071 |
#      | TC-072 |
#      | TC-073 |
#      | TC-074 |
#      | TC-075 |
#      | TC-076 |
#      | TC-077 |
#      | TC-078 |
#      | TC-079 |
#      | TC-080 |
#      | TC-081 |
#      | TC-082 |
#      | TC-083 |
#      | TC-084 |
#      | TC-085 |
#      | TC-086 |
#      | TC-087 |
#      | TC-088 |
#      | TC-089 |
#      | TC-090 |
#      | TC-091 |
#      | TC-092 |
#      | TC-093 |
#      | TC-094 |
#      | TC-095 |
#      | TC-096 |
#      | TC-097 |
#      | TC-098 |
#      | TC-099 |
#      | TC-100 |
#      | TC-101 |
#      | TC-102 |
#      | TC-103 |
#      | TC-104 |
#      | TC-105 |
#      | TC-106 |
#      | TC-107 |
#      | TC-108 |
#      | TC-109 |
#      | TC-110 |
#      | TC-111 |
#      | TC-112 |
#      | TC-113 |
#      | TC-114 |
#      | TC-115 |
#      | TC-116 |
#      | TC-117 |
#      | TC-118 |
#      | TC-119 |
#      | TC-120 |
#      | TC-121 |
#      | TC-122 |
#      | TC-123 |
#      | TC-124 |
#      | TC-125 |
#      | TC-126 |
#      | TC-127 |
#      | TC-128 |
#      | TC-129 |
#      | TC-130 |
#      | TC-131 |
#      | TC-132 |
#      | TC-133 |
#      | TC-134 |
#      | TC-135 |
#      | TC-136 |
#      | TC-137 |
#      | TC-138 |
#      | TC-139 |
#      | TC-140 |
#      | TC-141 |
#      | TC-142 |
#      | TC-143 |
#      | TC-144 |
#      | TC-145 |
#      | TC-146 |
#      | TC-147 |
#      | TC-148 |
#      | TC-149 |
#      | TC-150 |
#      | TC-151 |
#      | TC-152 |
#      | TC-153 |
#      | TC-154 |
#      | TC-155 |
#      | TC-156 |
#      | TC-157 |
#      | TC-158 |
#      | TC-159 |
#      | TC-160 |
#      | TC-161 |
#      | TC-162 |
#      | TC-163 |
#      | TC-164 |
#      | TC-165 |
#      | TC-166 |
#      | TC-167 |
#      | TC-168 |
#      | TC-169 |
#      | TC-170 |
#      | TC-171 |
#      | TC-172 |
#      | TC-173 |
#      | TC-174 |
#      | TC-175 |
#      | TC-176 |
#      | TC-177 |
#      | TC-178 |
#      | TC-179 |
#      | TC-180 |
#      | TC-181 |
#      | TC-182 |
#      | TC-183 |
#      | TC-184 |
#      | TC-185 |
#      | TC-186 |
#      | TC-187 |
#      | TC-188 |
#      | TC-189 |
#      | TC-190 |
#      | TC-191 |
#      | TC-192 |
#      | TC-193 |
#      | TC-194 |
#      | TC-195 |
#      | TC-196 |
#      | TC-197 |
#      | TC-198 |
#      | TC-199 |
#      | TC-200 |
#      | TC-201 |
#      | TC-202 |
#      | TC-203 |
#      | TC-204 |
#      | TC-205 |
#      | TC-206 |
#      | TC-207 |
#      | TC-208 |
#      | TC-209 |
#      | TC-210 |
#      | TC-211 |
#      | TC-212 |
#      | TC-213 |
#      | TC-214 |
#      | TC-215 |
#      | TC-216 |
#      | TC-217 |
#      | TC-218 |
#      | TC-219 |
#      | TC-220 |
#      | TC-221 |
#      | TC-222 |
#      | TC-223 |
#      | TC-224 |
#      | TC-225 |
#      | TC-226 |
#      | TC-227 |
#      | TC-228 |
#      | TC-229 |
#      | TC-230 |
#      | TC-231 |
#      | TC-232 |
#      | TC-233 |
#      | TC-234 |
#      | TC-235 |
#      | TC-236 |
#      | TC-237 |
#      | TC-238 |
#      | TC-239 |
#      | TC-240 |
#      | TC-241 |
#      | TC-242 |
#      | TC-243 |
#      | TC-244 |
#      | TC-245 |
#      | TC-246 |
#      | TC-247 |
#      | TC-248 |
#      | TC-249 |
#      | TC-250 |