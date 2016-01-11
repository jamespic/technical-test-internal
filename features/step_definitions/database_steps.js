/**
 * These steps read and write to the database directly, for test set-up and tear-down
 */
var expect = require("chai").expect

module.exports = function() {
  this.Given(/^I have a pre\-registered user with name "([^"]*)", email "([^"]*)", and password "([^"]*)"$/, function (username, email, password) {
    this.database.users[username] = {"email": email, "password": password}
  });

  this.Given(/^question (\d+) is "([^"]*)" with content "([^"]*)" by user "([^"]*)"$/, function (questionId, title, content, user) {
    this.database.questions[questionId] = {"questionId": questionId, "title": title, "content": content, "user": user, "upvotes": [], "downvotes": [], "answers": []}
  });

  this.Given(/^question (\d+) has a downvote from "([^"]*)"$/, function (questionId, user) {
    this.database.questions[questionId].downvotes.push(user)
  });

  this.Then(/^there should be a question with title "([^"]*)" and content "([^"]*)"$/, function (title, content) {
    var question = this.database.questions.find(function(q) {return q.title == title})
    expect(question).to.not.be.null
    expect(question).to.have.property("content", content)
  });
  
  this.Then(/^question (\d+) should have an upvote from "([^"]*)"$/, function (questionId, user) {
    expect(this.database.questions[questionId].upvotes).to.include(user)
  });
  
  this.Then(/^answer (\d+) on question (\d+) should have an upvote from "([^"]*)"$/, function (answerId, questionId, user, callback) {
    // todo: don't know why this is timing out. need to investigate, learn about Chai and Node and debugging tools.
    expect(this.database.questions[questionId].answers[answerId].upvotes).to.include(user)
  });

  this.Then(/^question (\d+) should have an answer "([^"]*)"$/, function (questionId, answerContent) {
    var answer = this.database.questions[questionId].answers.find(function(a) {return a.content === answerContent})
    expect(answer).to.not.be.null
    expect(answer).to.not.be.undefined
  });
  
  this.Given(/^question (\d+) has no answers$/, function (questionId) {
    // todo: not sure how to delete. leaving it for now.
    // this.database.questions[questionId].answers
  });
  
}
