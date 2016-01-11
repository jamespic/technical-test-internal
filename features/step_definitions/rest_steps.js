/*
 * These steps call the application, through its REST API
 */

var expect = require("chai").expect
var qa = require("../../lib/q-and-a")

module.exports = function() {
  this.Before(function() {
    this.database = new qa.Database()
    this.application = qa.application(this.database)

    this.assertStatus = function assertStatus(code) {
      expect(this.result.status).to.equal(parseInt(code))
    }
    
    this.assertSuccess = function assertSuccess() {
      this.assertStatus(200)
    }
    
    Object.defineProperty(this, "response", {"get": function response() {return this.result.body}})
  })

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
  
  this.Then(/^I should see a question with (\d+) downvote$/, function (downvotes) {
    this.assertSuccess()
    expect(this.response).to.have.property("downvotes", parseInt(downvotes))
  });
  
  this.Then(/^I should receive a Not Found error$/, function () {
    this.assertStatus(404)
  });

  this.When(/^I look up a question that does not exist$/, function () {
    this.result = this.application("GET", "/question/9999")
  });
  
  this.When(/^requesting answer (\d+) of question (\d+)$/, function (answerId, questionId) {
    this.result = this.application("GET", "/question/" + questionId + '/answer/' + answerId)
  });
  
}
