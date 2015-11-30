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
    ["GET", "/user/:userName", function(params) {
        if (params.userName in database.users) {
          return ok(database.users[params.userName])
        } else {
          return notFound
        }
      }
    ],
    ["POST", "/user/:userName", function(params, data) {
        if (params.userName in database.users) {
          return conflict
        } else {
          database.users[params.userName] = {"userName": params.userName, "email": data.email, "password": data.password}
          return created
        }
      }
    ],
    ["GET", "/question/:questionId", function(params) {
        var question = database.questions[params.questionId]
        return ok(hideVotes(question))
      }
    ],
    ["GET", "/question", function(params) {
      return ok(database.questions.map(hideVotes))
    }],
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
        var answer = database.questions[params.questionId].answers[params.answerId]
        return ok(hideVotes(answer))
      }
    ],
    ["POST", "/question/:questionId/answer/:answerId/upvote", function(params) {
        var answer = database.questions[params.questionId].answers[params.answerId]
        var user = params.user
        answer.upvotes.push(user)
        return created
      }
    ],
    ["POST", "/question/:questionId/answer/:answerId/downvote", function(params) {
        var answer = database.questions[params.questionId].answers[params.answerId]
        var user = params.user
        answer.upvotes.push(user)
        return created
      }
    ]
  )
}

function hideVotes(item) {
  item = routing.deepcopy(item)
  item.upvotes = item.upvotes.length
  item.downvotes = item.downvotes.length
  return item
}
