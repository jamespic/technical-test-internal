Feature: Answering questions
  As a know-it-all
  In order to show off my knowledge
  I want to answer questions
  
  Scenario: Answering a question
    Given question 0 is "What's the answer?" with content "What exactly is the answer?" by user "john"
    When "john" answers question 0 with "The answer is 42"
    Then question 0 should have an answer "The answer is 42"