/*
 * A routing helper. You shouldn't need to change this as part of your test.
 */
var urlHelper = require("url")
 
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
    
    routeObj.pathRe = RegExp("^" + routeObj.pathExpr.replace(re, "([^/\\?#]*)") + "$")
    routeObj.canHandle = function canHandle(method, url) {
      var pathname = urlHelper.parse(url).pathname
      return (this.method === method) && this.pathRe.exec(pathname)
    }
    routeObj.handle = function handle(method, url, data) {
      var parsedUrl = urlHelper.parse(url, true)
      var params = parsedUrl.query
      
      var splitUrl = url.split("?")
      var path = parsedUrl.pathname
      
      var groups = this.pathRe.exec(path).slice(1)
      for (var i = 0; i < this.groups.length; i++) {
        params[this.groups[i]] = groups[i]
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