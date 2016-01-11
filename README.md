Hermes QA Technical Test
========================

For the Hermes QA Technical Test, you'll be working with a fake application. The application is a simple RESTful service, for use by
a Question and Answer website, like [Stack Overflow](http://stackoverflow.com/).

The application is written in [NodeJS](https://nodejs.org), and it has a basic suite of tests written in [cucumber.js](https://github.com/cucumber/cucumber-js), that you can use as your starting point.

There's no web interface (it's a RESTful service), but you can query it with your favourite REST client if that suits your way of working.

Your goal is to test it. Find as many issues as you can, and raise them in [GitHub](https://github.com/). Expand the automated test coverage as far as you can.

You should spend about 2 hours on the problem (we won't penalise you if you go a little over). Once you're done, make sure you've
committed your work to your GitHub repository, and send us a pull request.

Prerequisites
-------------

You should have been advised by your recruiter to:

1. Ensure you have  [NodeJS 5.0 or above](https://nodejs.org) on your computer
2. Ensure you have an up-to-date version of [Git](https://git-scm.com/downloads) on your computer
3. Ensure you hava a [GitHub](https://github.com) account
4. Familiarise yourself with [cucumber.js](https://github.com/cucumber/cucumber-js)
5. Read up on RESTful Web Services. You may also want to familiarise yourself with a REST Client, such as
   [Advanced REST Client](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo) or [Postman](https://www.getpostman.com/)

Getting Started
---------------

1. Fork this repository, and clone it to your local machine
2. From the command line, run `npm install` to install dependencies

Objectives
----------

Your objective is to add as much value as you can to this project. We'd recommend you look at doing some of the following things:

- Find any issues you can and raise them as issues on GitHub. Raise anything that you think is broken, problematic, or counterintuitive.
  _Issues don't have to be in code_. They can also be bad specifications or inaccurate documentation (including this document). If in doubt, raise it as
  an issue, even if it feels more like a question.
- Create more automated test cases. Try and think about positive, negative, and corner cases. Some of the features, like answer
  vote counts, will probably need you to write your own step definitions.
- Add some new features, like the ability to to edit or delete questions, or find questions and answers from specific users, and test them

We don't expect you to complete all these objectives in the time. We're more interested in how you approach the problem.

Running Tests
-------------

From the command line, run tests with:

```
npm test
```

or alternatively:

```
node .\node_modules\cucumber\bin\cucumber.js
```

Running The Application
-----------------------

It's not necessary to run the application in order to execute the cucumber tests, but if you would like to interrogate it with your favourite REST client,
you can start an instance of the application with:

```
npm start
```

The API Specification
-------

The application should support the following operations:

- `GET /user/:userName`: Retrieve a user of the system. The response will be JSON like `{"userName": "john", "email": "john@example.com", "password": "password1"}`
- `POST /user/:userName`: Create a new user, named `userName`. Your request should be JSON like `{"email": "john@example.com", "password": "password1"}`, and you will receive `201 Created` on success.
- `GET /question/:questionId`: Retrieve information about a question. The response will be JSON like
  `{"user":"john","title":"A Question","content":"A question","upvotes":0,"downvotes":0,"answers":[],"questionId":0}`
- `POST /question`: Create a new question. Your request should be JSON like `{"user": "john", "title": "Question Title", "content": "A question"}`, and your response will be the same data,
  enriched with the id of the new question, as `questionId`.
- `POST /question/:questionId/upvote?user=:userName`: Create an upvote for a user on a question. You will receive `201 Created` on success
- `POST /question/:questionId/downvote?user=:userName`: Create a downvote for a user on a question. You will receive `201 Created` on success
- `POST /question/:questionId/answer`: Create an answer for a question. Your request should be JSON like `{"user": "john", "content": "An answer"}`, and your response will be the same data,
  enriched with the id of the new answer, as `answerId`.
- `GET /question/:questionId/answer/:answerId`: Retrieve a specific answer. The response will be JSON like `{"user":"john","content":"An answer","upvotes":1,"downvotes":0,"answerId":0}`
- `POST /question/:questionId/answer/:answerId/upvote?user=:userName`: Create an upvote for a user on a question. You will receive `201 Created` on success
- `POST /question/:questionId/answer/:answerId/downvote?user=:userName`: Create a downvote for a user on a question. You will receive `201 Created` on success

All GET operations should return HTTP 404 if there is no corresponding resource found.

