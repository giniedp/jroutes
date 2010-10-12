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
This will generate a file in 
    public/javascripts/jroutes.js
Include the javascript in your application layout or wherever you need the routes
    
Usage
=====
Whenever you have changed your routes don't forget to run
    rake jroutes:generate
to synchronize the javascript routes.
Now you can use your routenames from your application in your javascript:
    Router.foo_bar_path()
or
    Router.foo_bar_url()
which returns the path or the url of the route "foo_bar"

You can also pass arguments to fill required and optional url parameters
    Router.foo_bar_path("foo", 1)
You can pass named arguments to fill url parameters
    Router.foo_bar_path({ controller : "foo", id : 1, action : "bar" })

If you don't want to run the generator, you can push routes yourself with:
    Router.pushRoute("example", "/foo/:foo/bar/:bar")
Then the following methods will be available
    Router.example_path()
and
    Router.example_url()
    
It is also possible to add routes with optional arguments:
    Router.pushRoute("example", "/foo/:foo(/bar/:bar)")
Then running 
    Router.example_path("test")
will result in
    "/foo/test"
By running 
    Router.example_path("test", "anotherTest")
will result in
    "/foo/test/bar/anotherTest"

Arguments that do not match the url parameters will be appended do the result
    Router.example_path({ foo : "foo", bar : "bar", id : "1"})
results in
    "/foo/foo/bar/bar?id=1"
   