/*
 * A Q&A Application witha rest API. Users can ask questions, answer questions, and vote on questions and answers.
 */
var routing = require("./routing")
var ok = routing.ok
var notFound = routing.notFound
var conflict = routing.conflict
var created = routing.created
 
exports.Database = function Database() {
  this.users = {}
  this.questions = []
}

exports.application = function application(database) {
  return routing(
    ["GET", "/user/:userName", function(params) {return ok(database.users[params.userName])}],
    ["POST", "/user/:userName", function(params, data) {
        if (params.userName in database.users) {
          return notFound
        } else {
          database.users[params.userName] = {"email": data.email, "password": data.password}
          return created
        }
      }
    ],
    ["GET", "/question/:questionId", function(params) {
        var question = routing.deepcopy(database.questions[params.questionId])
        question.upvotes = question.upvotes.length // users can't see who upvoted and downvoted
        question.downvotes = question.downvotes.length
        return ok(question)
      }
    ],
    ["POST", "/question", function(params, data) {
      var questionTitle = data.questionTitle
      if (database.questions.find(function(q) {return q.title == questionTitle})) {
        return conflict
      } else {
        data.upvotes = []
        data.downvotes = []
        var questionId = database.questions.push(data) - 1
        data.questionId = questionId
        return ok(data)
      }
    }],
    ["POST", "/question/:questionId/:voteType", function(params, data) {
      var question = database.questions[params.questionId]
      var user = params.user
      var voteType = params.voteType
      if (["upvote", "downvote"].indexOf(voteType) === -1) {
        return notFound
      }
      question[voteType + "s"].push(user)
      return created
    }]
  )
}
