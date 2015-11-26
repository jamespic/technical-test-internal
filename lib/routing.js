/*
 * A routing helper. You shouldn't need to change this as part of your test.
 */
 
function deepcopy(x) {
  if (typeof x === "object") return JSON.parse(JSON.stringify(x))
  else return x
}
 
module.exports = function routing() {
  var routes = Array.prototype.slice.apply(arguments)
  var routeObjs = routes.map(function (routeDef) {
    var routeObj = {
      method: routeDef[0],
      pathExpr: routeDef[1],
      handler: routeDef[2],
      groups: []
    }
    
    var re = /:(\w+)/g
    var group
    while (group = re.exec(routeObj.pathExpr)) {
      routeObj.groups.push(group[1])
    }
    
    routeObj.pathRe = RegExp("^" + routeObj.pathExpr.replace(re, "([^/\\?#]*)") + "(?:\\?.*)?$")
    routeObj.canHandle = function canHandle(method, url) {
      return (this.method === method) && this.pathRe.exec(url)
    }
    routeObj.handle = function handle(method, url, data) {
      var params = {}
      
      var splitUrl = url.split("?")
      var path = splitUrl[0]
      var query = splitUrl[1]
      
      var groups = this.pathRe.exec(url).slice(1)
      for (var i = 0; i < this.groups.length; i++) {
        params[this.groups[i]] = groups[i]
      }
      
      if (query) {
        var queryTerms = query.split("&")
        queryTerms.forEach(function(term) {
          var splitTerm = term.split("=")
          var name = splitTerm[0]
          var value = splitTerm[1]
          params[name] = value
        })
      }
      
      return this.handler(params, data)
    }
    return routeObj
  })
  
  return function route(method, url, data) {
    console.log("Received " + method + " request for " + url + " with data :\n" + JSON.stringify(data))
    var handler = routeObjs.find(function(obj) {return obj.canHandle(method, url)})
    
    if (handler == null) {
      return {"status": 404, "message": "Not Found"}
    }
    
    try {
      var response = handler.handle(method, url, deepcopy(data))
    } catch(e) {
      console.log("Internal Server Error:\n" + e.stack)
      return {"status": 500, "message": "Internal Server Error", "body": e.stack}
    }
    
    console.log("Sent response:\n" + JSON.stringify(response))
    return response
  }
}

module.exports.deepcopy = deepcopy
module.exports.ok = function ok(body) {return {"status": 200, "message": "OK", "body": body}}
module.exports.notFound = {"status": 404, "message": "Not Found"}
module.exports.created = {"status": 201, "message": "Created"}
module.exports.conflict = {"status": 409, "message": "Conflict"}