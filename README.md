jroutes
=====================================================

This plugin enables spriteanimation on your website. It requires a series of 
images stiched together into a single spritesheet and is able to play these 
images frame by frame which results in an animation. The aim of this plugin is
to provide a 360° view of some kind of product. There is no flash needed, 
everything is done with javascript and the jQuery framework.

Installation
=====
Install the plugin into vendor/plugins:
    rails plugin install git@github.com:giniedp/jroutes.git
run
    rake jroutes:generate 
This will generate the following file 
    public/javascripts/jroutes.js
Include the jroute.js in your application layout or wherever you need the routes
    javascript_include_tag 'jroutes'
    
Usage
=====
Whenever you have changed your routes don't forget to run
    rake jroutes:generate
to synchronize the javascript routes.
Now you can use your application routes in your javascript:
    Router.foo_bar_path()
    Router.foo_bar_url()
which returns the path or the url of the route *foo_bar*

You can also pass arguments to fill required and optional url parameters. Named arguments are supported.
    Router.foo_bar_path("foo", 1)
    Router.foo_bar_path({ controller : "foo", id : 1 })

You can push routes yourself using:
    Router.pushRoute("example", "/foo/:foo/bar/:bar")
Then the following methods will be then available:
    Router.example_path()
    Router.example_url()
    
Routes with optional parameters are also supported, like you are used to from rails
    Router.pushRoute("example", "/foo/:foo(/bar/:bar)")
    Router.example_path("test")                 // => "/foo/test"
    Router.example_path("test", "anotherTest")  // => "/foo/test/bar/anotherTest"

Arguments that do not match the url parameters will be appended do the result
    Router.example_path({ foo : "foo", bar : "bar", id : "1"}) // => "/foo/foo/bar/bar?id=1"
   