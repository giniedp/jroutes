var Router = {
  
  settings : {
    protocol : null,
    host : null,
    port : null,
    path : null
  },

  // collection of named routes
  Routes : {},  
  
  // Resource object that can be instantiated. This will create default routes
  // for the instance
  Resource : function (model, controller, nest){
    this.currentId = "";
    this.model = model;
    this.controller = controller;
    this.nest = nest;
    
    this.path = function(){
      if (typeof(this.nest) != "undefined" && this.nest != null){
        return this.nest.path() + "/" + this.controller;
      } else {
        return this.controller;
      }
    };
    
    this.pathName = function(singular){
      var name = singular ? "model" : "controller";
      if (typeof(this.nest) != "undefined" && this.nest != null){
        return this.nest.pathName(true) + "_" + this[name];
      } else {
        return this[name];
      }
    };
    
    this.clozePath = function(collection){
      if (typeof(this.nest) != "undefined" && this.nest != null){
        if (collection){
          return this.nest.clozePath(false) + "/" + this.controller;
        } else {
          return this.nest.clozePath(false) + "/" + this.controller + "/:" + this.model + "_id";
        }
      } else {
        if (collection){
          return "/" + this.controller;
        } else {
          return "/" + this.controller + "/:" + this.model + "_id";
        }
      }
    };
    
    this.create = function(data, dataType, success, error) {
      var url = Router.route(this.pathName(false) + "_path");
      Router.Restful.create(url, data, dataType, success, error);
    };
    
    this.update = function(id, data, dataType, success, error) {
      var url = Router.route(this.pathName(true) + "_path", id);
      Router.Restful.update(url, data, dataType, success, error);
    };
    
    this.destroy = function(id, data, dataType, success, error) {
      var url = Router.route(this.pathName(true) + "_path", id);
      Router.Restful.destroy(url, data, dataType, success, error);
    };
    
    path = this.path();
    pathNameS = this.pathName(true);
    pathNameP = this.pathName(false);
    clozeS = this.clozePath(false);
    clozeP = this.clozePath(true);
    
    Router.pushRoute(pathNameP,             clozeP);
    Router.pushRoute(pathNameS,             clozeS);
    Router.pushRoute("new_" + pathNameS,    clozeS + "/new")
    Router.pushRoute("edit_" + pathNameS,   clozeS + "/edit")
  },
  
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
    var leadingExp = "^[\\/\\w\\-\\_]*" + key + "[\\/\\w\\-\\_]*\\(";
    var optionalMatch = new RegExp(optionalExp).exec(string);
    var leadingMatch = new RegExp(leadingExp).exec(string);
    
    if (optionalMatch && leadingMatch == null) {
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
    
    return string.replace(new RegExp(key), value);
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
  },
  
  Restful : {
    create : function(url, data, dataType, success, error){
      $.ajax({
        type      : "POST",
        url       : url,
        data      : data,
        dataType  : dataType,
        success   : success,
        error     : error
      });
    },
    update : function(url, data, dataType, success, error){
      $.ajax({
        type      : "PUT",
        url       : url,
        data      : data,
        dataType  : dataType,
        success   : success,
        error     : error
      });
    },
    destroy : function(url, data, dataType, success, error){
      $.ajax({
        type      : "DELETE",
        url       : url,
        data      : data,
        dataType  : dataType,
        success   : success,
        error     : error
      });
    }
  }
}
