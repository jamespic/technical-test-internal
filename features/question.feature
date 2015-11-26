Feature: Asking Questions
  As a questioner
  In order to have my questions answered
  I want to ask questions
  
  Background: 
    Given I have a pre-registered user with name "john", email "john@example.com", and password "password1"
    
  Scenario: Asking a question
    When "john" asks "What's the answer?" with content "What exactly is the answer?"
    Then there should be a question with title "What's the answer?" and content "What exactly is the answer?"

  Scenario: Voting on questions
    Given question 0 is "What's the answer?" with content "What exactly is the answer?" by user "john"
    When "john" upvotes on question 0
    Then question 0 should have an upvote from "john"
    
  Scenario: Counting votes
    Given question 0 is "What's the answer?" with content "What exactly is the answer?" by user "john"
    And question 0 has a downvote from "john"
    When I look up question 0
    Then I should see a question with 1 downvote