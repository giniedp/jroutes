(function(){
  var Router;
  Router = this.Router = {};
  Router.window = this.window;
  
  Router.settings = {
    protocol : null,
    host : null,
    port : null,
    path : null    
  };

  // collection of named routes
  Router.Routes = {};
  
  Router.generate = function(name, parameters){
    if (arguments.length === 0){
      throw("no arguments given");
    }
    
    var route = Router.Routes[name];
    if (route === undefined){
      throw("no route defined with name: " + name);
    }
    
    // replace cloze route with values
    if (parameters.length === 1 && typeof(parameters[0]) === "object"){
      var key = 0;
      for(key in parameters[0]){
        if (parameters[0].hasOwnProperty(key)){
          var value = parameters[0][key];
          if (route.match(":" + key)){
            route = Router.replaceHelper(":" + key, route, value);
          } else {
            route += [route.match(/\?/) ? "&" : "?", key, "=", value].join("");
          }          
        }
      }
    } else {
      var i = 0;
      for (i = 0; i < parameters.length; i++){
        route = Router.replaceHelper(":\\w+", route, parameters[i]);
      }   
    }
    
    // blank out all remaining params
    while(/:\w+/.test(route)){
      route = route.replace(/:\w+/, "");
    }
    
    // blank out all optional params
    while(/\(.*\)/.test(route)){
      route = route.replace(/\(.*\)/, "");
    }
    return route;
  };
  
  Router.replaceHelper = function(key, string, value){
    var optionalExp = "\\([a-zA-Z0-9\\/\\$\\-\\_\\.\\+\\!\\*\\'\\,]*" + key;
    var leadingExp = "^(([a-zA-Z0-9\\/\\$\\-\\_\\.\\+\\!\\*\\'\\,])*(" + key + "))";
    var optionalMatch = new RegExp(optionalExp).exec(string);
    var leadingMatch = new RegExp(leadingExp).exec(string);

    if (optionalMatch !== null && leadingMatch === null) {
      // has only optional parameters e.g. /path(/:bar)
      //var match = optionalMatch[0];
      var start = optionalMatch.index;

      var count = 0;
      var length = 0;      
      var chars = string.substring(start).split("");
      // search closing bracket
      var i = 0;
      for (i = 0; i < chars.length; i++){
        length += 1;
        if (chars[i] === "("){ count += 1; }
        if (chars[i] === ")"){ count -= 1; }
        if (count === 0){ break; }
      }
      var end = start + length;      
      string =  string.substring(0, start) + string.substring(start + 1, end - 1) + string.substring(end);
    }
    string = string.replace(new RegExp(key), value);
    return string;
  };
  
  Router.generateBase = function(){
    var result = "";
    
    if (Router.settings.protocol !== null){
      result += (Router.settings.protocol + "://");
    } else {
      result += (Router.window.location.protocol + "//");
    }
    
    if (Router.settings.host !== null){
      result += Router.settings.host;
    } else {
      result += Router.window.location.hostname;
    }
    
    if (Router.settings.port !== null){
      result += ":" + Router.settings.port;
    } else if (Router.window.location.port !== "") {
      result += ":" + Router.window.location.port;
    }
    
    if (Router.settings.path !== null){
      result += ":" + Router.settings.path;
    }
    
    return result;
  };
  
  // adds a named route
  Router.pushRoute = function(name, route){
    var pathName = name + "_path";
    var urlName = name + "_url";
    Router.Routes[name] = route;
    
    Router[pathName] = function(){
      return Router.generate(name, arguments);
    };

    Router[urlName] = function(){
      return Router.generateBase() + Router.generate(name, arguments);
    };
  };
}());
