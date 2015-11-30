Hermes QA Technical Test
========================

For the Hermes QA Technical test, you'll be working with a toy application. The application is a simple RESTful service, for use by
a Question and Answer website, like [Stack Overflow](http://stackoverflow.com/).

The application is written in NodeJS, and it has a basic suite of tests written in [cucumber.js](https://github.com/cucumber/cucumber-js), that you can use as your starting point.

There's no web interface (it's a RESTful service), but you can query it with your favourite REST client if that suits your way of working.

Your goal is to test it. Find as many issues as you can, and raise them in [GitHub](https://github.com/). Expand the automated test coverage as far as you can.

You should spend about 2 hours on the problem (we won't penalise you if you go a little over). Once you're done, make sure you've
committed your work to your GitHub repository, and send us a pull request.

Prerequisites
-------------

You should have been advised by your recruiter to:

1. Ensure you have an up-to-date version of [NodeJS](https://nodejs.org) for your computer
2. Ensure you have an up-to-date version of [Git](https://git-scm.com/downloads) on your computer
3. Ensure you hava a [GitHub](https://github.com) account
4. Familiarise yourself with [cucumber.js](https://github.com/cucumber/cucumber-js)
5. Read up on RESTful Web Services

Getting Started
---------------

1. Clone this repository to your local machine
2. From the command line, run `npm install` to install dependencies

Objectives
----------

###Primary Objective###
Find any issues you can and raise them on GitHub. Raise anything that you think is broken, problematic, or counterintuitive.
Issues don't have to be in code - they can also be bad specifications or inaccurate documentation.

###Secondary Objectives###
1. Create more automated test cases. Try and think about positive, negative, and corner cases.
2. Create some test cases around answer vote counts. You'll probably need to implement some steps yourself for this.
3. Add some new features (maybe the ability to to edit or delete questions, or find questions and answers from specific users), and test them

It's OK if you don't manage all these objectives. We're more interested in how you approach the problem.

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

The API
-------

The application supports the following operations:

- `GET /user/:userId`: Retrieve a user of the system. The response will be JSON like `{"userName": "john", "email": "john@example.com", "password": "password1"}`
- `POST /user/:userId`: Create a new user. Your request should be JSON like `{"email": "john@example.com", "password": "password1"}`, and you will receive `201 Created` on success.
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