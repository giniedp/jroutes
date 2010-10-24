jroutes
=====================================================
This plugin enables named routes of your rails application in your javascript.

Requirements
=====
Rails3

Installation
=====
In your Gemfile

    gem 'jroutes', :git => 'git://github.com/giniedp/jroutes.git'

Then run
    
    bundle install
    
and

    rake jroutes:generate 
    
This will generate (**overwrite**) the following file 

    public/javascripts/jroutes.js
    
Include the jroute.js in your application layout or wherever you need the routes

    = javascript_include_tag 'jroutes'

Usage
=====
Whenever you have changed your routes don't forget to synchronize the javascript routes with:
    rake jroutes:generate
All your named routes of your application become available as javascript methods:
    Router.foo_bar_path() // gets the path of the 'foo_bar' route
    Router.foo_bar_url()  // gets the url with protocol, host and port of the 'foo_bar' route

You can also pass arguments to fill required and optional url parameters. Named arguments are supported.
    Router.foo_bar_path("foo", 1)                       // paremeters are filled in the order they are passed
    Router.foo_bar_path({ controller : "foo", id : 1 }) // parameters are filled by name lookup

You can push routes yourself with:
    Router.pushRoute("example", "/foo/:foo/bar/:bar")
This adds the following Router methods:
    Router.example_path()
    Router.example_url()
    
Routes with optional parameters are also supported, like you are used from rails:
    Router.pushRoute("example", "/foo/:foo(/bar/:bar)")
    Router.example_path("test")                 // => "/foo/test"
    Router.example_path("test", "anotherTest")  // => "/foo/test/bar/anotherTest"

Arguments that do not match the url parameters will be appended do the result
    Router.example_path({ foo : "foo", bar : "bar", id : "1"}) // => "/foo/foo/bar/bar?id=1"
   
To customize the host settings use the Router.settings object
    Router.settings.protocol = "http"         // protocol to use
    Router.settings.host = "www.example.com"  // host to use
    Router.settings.port = "3000"             // port to use
    Router.settings.path = ""                 // base path to use
These settings will be used to generate urls. If the settings are not set the Router
will use the protocol, host and port from *window.location*

Copyright
=====

Copyright (c) 2010 Alexander Gräfenstein. See LICENSE for details.
