/*
 * This is a start-up script, and is only used whan starting the application with `npm start`. It's not
 * used by Cucumber tests, so it's only relevant if you're running the application with a REST Client.
 */

var qa = require("./lib/q-and-a")
var http = require("http")

var port = 8212
var app = qa.application(new qa.Database())

var server = http.createServer(function(req, res) {
  var requestBody = ""
  
  req.on("data", function(chunk) {
    requestBody += chunk.toString()
  })
  
  req.on("end", function() {
    try {
      requestBody = JSON.parse(requestBody)
    } catch (e) {
      // Couldn't parse it, so just leave it as it is
    }
    var response = app(req.method, req.url, requestBody)
    var responseBody = response.body
    var contentType = "text/plain"
    if (typeof responseBody === "object") {
      responseBody = JSON.stringify(responseBody)
      contentType = "application/json"
    }
    res.writeHead(response.status, response.message, {"Content-Type":contentType})
    res.end(responseBody)
  })
})

server.listen(port, function() {
  console.log("Listening on http://localhost:%s", port)
})