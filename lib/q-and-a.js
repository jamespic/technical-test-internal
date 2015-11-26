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
      var title = data.title
      if (database.questions.find(function(q) {return q.title == title})) {
        return conflict
      } else {
        data.upvotes = []
        data.downvotes = []
        data.answers = []
        var questionId = database.questions.push(data) - 1
        data.questionId = questionId
        return ok(data)
      }
    }],
    ["POST", "/question/:questionId/upvote", function(params) {
        var question = database.questions[params.questionId]
        var user = params.user
        question.upvotes.push(user)
        return created
      }
    ],
    ["POST", "/question/:questionId/downvote", function(params) {
        var question = database.questions[params.questionId]
        var user = params.user
        question.upvotes.push(user)
        return created
      }
    ],
    ["POST", "/question/:questionId/answer", function(params, data) {
        var question = database.questions[params.questionId]
        data.upvotes = []
        data.downvotes = []
        var answerId = question.answers.push(data) - 1
        data.answerId = answerId
        return ok(data)
      }
    ],
    ["GET", "/question/:questionId/answer/:answerId", function(params) {
        var answer = routing.deepcopy(database.questions[params.questionId].answers[params.answerId])
        answer.upvotes = answer.upvotes.length // users can't see who upvoted and downvoted
        answer.downvotes = answer.downvotes.length
        return ok(answer)
      }
    ],
    ["POST", "/question/:questionId/answer/:answerId/upvote", function(params) {
        var answer = routing.deepcopy(database.questions[params.questionId].answers[params.answerId])
        var user = params.user
        answer.upvotes.push(user)
        return created
      }
    ],
    ["POST", "/question/:questionId/answer/:answerId/downvote", function(params) {
        var answer = routing.deepcopy(database.questions[params.questionId].answers[params.answerId])
        var user = params.user
        answer.upvotes.push(user)
        return created
      }
    ]
  )
}
