var expect = require("chai").expect
var qa = require("../../lib/q-and-a")

module.exports = function() {
  this.Before(function() {
    this.database = new qa.Database()
    this.application = qa.application(this.database)
    
    this.assertStatus = function assertStatus(code) {
      expect(this.result.status).to.equal(code)
    }
    
    this.assertSuccess = function assertSuccess() {
      this.assertStatus(200)
    }
    
    Object.defineProperty(this, "response", {"get": function response() {return this.result.body}})
  })
  
  this.Given(/^I have a pre\-registered user with name "([^"]*)", email "([^"]*)", and password "([^"]*)"$/, function (username, email, password) {
    this.database.users[username] = {"email": email, "password": password}
  });

  this.Given(/^question (\d+) is "([^"]*)" with content "([^"]*)" by user "([^"]*)"$/, function (questionId, title, content, user) {
    this.database.questions[questionId] = {"questionId": questionId, "title": title, "content": content, "user": user, "upvotes": [], "downvotes": [], "answers": []}
  });

  this.Given(/^question (\d+) has a downvote from "([^"]*)"$/, function (questionId, user) {
    this.database.questions[questionId].downvotes.push(user)
  });

  this.When(/^I register a new user "([^"]*)" with email "([^"]*)" and password "([^"]*)"$/, function (username, email, password) {
    this.result = this.application("POST", "/user/" + username, {"email": email, "password": password})
  });

  this.When(/^I lookup details of user "([^"]*)"$/, function (username) {
    this.result = this.application("GET", "/user/" + username)
  });

  this.When(/^"([^"]*)" asks "([^"]*)" with content "([^"]*)"$/, function (user, title, content) {
    this.result = this.application("POST", "/question", {"title": title, "user": user, "content": content})
  });

  this.When(/^"([^"]*)" upvotes on question (\d+)$/, function (user, questionId) {
    this.result = this.application("POST", "/question/" + questionId + "/upvote?user=" + user)
  });

  this.When(/^I look up question (\d+)$/, function (questionId) {
    this.result = this.application("GET", "/question/" + questionId)
  });

  this.When(/^"([^"]*)" answers question (\d+) with "([^"]*)"$/, function (user, questionId, content) {
    this.result = this.application("POST", "/question/" + questionId + "/answer", {"user": user, "content": content})
  });

  this.Then(/^the user "([^"]*)" should be registered, with email "([^"]*)" and password "([^"]*)"$/, function (username, email, password) {
    this.assertStatus(201)
    var user = this.database.users[username]
    expect(user).to.not.be.null
    expect(user).to.have.property("email", email)
    expect(user).to.have.property("password", password)
  });
  
  this.Then(/^I should see a user with email "([^"]*)" and password "([^"]*)"$/, function (email, password) {
    this.assertSuccess()
    expect(this.response).to.not.be.null
    expect(this.response).to.have.property("email", email)
    expect(this.response).to.have.property("password", password)
  });

  this.Then(/^there should be a question with title "([^"]*)" and content "([^"]*)"$/, function (title, content) {
    var question = this.database.questions.find(function(q) {return q.title == title})
    expect(question).to.not.be.null
    expect(question).to.have.property("content", content)
  });
  
  this.Then(/^question (\d+) should have an upvote from "([^"]*)"$/, function (questionId, user) {
    expect(this.database.questions[questionId].upvotes).to.include(user)
  });

  this.Then(/^I should see a question with (\d+) downvote$/, function (downvotes) {
    this.assertSuccess()
    expect(this.response).to.have.property("downvotes", parseInt(downvotes))
  });
  
  this.Then(/^question (\d+) should have an answer "([^"]*)"$/, function (questionId, answerContent) {
    var answer = this.database.questions[questionId].answers.find(function(a) {return a.content === answerContent})
    expect(answer).to.not.be.null
    expect(answer).to.not.be.undefined
  });
}