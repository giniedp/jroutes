# Jroutes
module Jroutes

  JS_SOURCE = File.join(File.dirname(__FILE__), 'javascripts', 'jroutes.js')
  JS_MIN = File.join(File.dirname(__FILE__), 'javascripts', 'jroutes.js')

  JS_TARGET = Rails.root.join('public', 'javascripts', 'jroutes.js')
  JS_MIN_TARGET = Rails.root.join('public', 'javascripts', 'jroutes.min.js')
  
end