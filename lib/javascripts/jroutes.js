var Router = {
  
  settings : {
    protocol : null,
    host : null,
    port : null,
    path : null
  },

  // collection of named routes
  Routes : {},  
  
  generate : function(name, parameters){
    if (arguments.length == 0){
      throw("no arguments given");
    }
    
    var route = Router.Routes[name];
    if (route == undefined){
      throw("no route defined with name: " + name);
    }
    
    // replace cloze route with values
    if (parameters.length == 1 && typeof(parameters[0]) == "object"){
      for(var key in parameters[0]){
        var value = parameters[0][key];
        if (route.match(":" + key)){
          route = Router.replaceHelper(":" + key, route, value);
        } else {
          route += [route.match(/\?/) ? "&" : "?", key, "=", value].join("");
        }
      }
    } else {
      for (var i = 0; i < parameters.length; i++){
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
  },
  
  replaceHelper : function(key, string, value){
    var optionalExp = "\\(.*" + key + ".*\\)";
    var leadingExp = "^(([a-zA-Z0-9\\/\\$\\-\\_\\.\\+\\!\\*\\'\\,])*(" + key + "))"
    var optionalMatch = new RegExp(optionalExp).exec(string);
    var leadingMatch = new RegExp(leadingExp).exec(string);
    
    if (optionalMatch != null && leadingMatch == null) {
      // has only optional parameters e.g. /path(/:bar)
      
      var match = optionalMatch[0];
      var start = optionalMatch.index;
      
      var chars = match.split("");
      var count = 0;
      var length = 0;
      
      // search closing bracket
      for (var i = 0; i < chars.length; i++){
        length += 1;
        if (chars[i] == "("){ count += 1; }
        if (chars[i] == ")"){ count -= 1; }
        if (count == 0){ break; }
      }

      var end = start + length;
      
      string =  string.substring(0, start) + match.substring(1, length - 1) + string.substring(end);
    }
    string = string.replace(new RegExp(key), value);
    return string;
  },
  
  generateBase : function(){
    var result = "";
    
    if (Router.settings.protocol != null){
      result += (Router.settings.protocol + "://");
    } else {
      result += (window.location.protocol + "//");
    }
    
    if (Router.settings.host != null){
      result += Router.settings.host;
    } else {
      result += window.location.hostname;
    }
    
    if (Router.settings.port != null){
      result += ":" + Router.settings.port;
    } else if (window.location.port != "") {
      result += ":" + window.location.port;
    }
    
    if (Router.settings.path != null){
      result += ":" + Router.settings.path;
    }
    
    return result;
  },
  
  // adds a named route
  pushRoute : function(name, route){
    pathName = name + "_path";
    urlName = name + "_url";
    Router.Routes[pathName] = route;
    
    Router[pathName] = new Function(pathName, 
      "return Router.generate('" + pathName + "', arguments);");
      
    Router[urlName] = new Function(urlName, 
      "return Router.generateBase() + Router.generate('" + pathName + "', arguments);");
  }
}