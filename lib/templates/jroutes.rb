# Use this setup block to configure all options available in Jroutes.
Jroutes.setup do |config|
  
  # Set the path to the output javascript file
  # default is "public/javascripts/jroutes.js"
  #
  config.output_path = "public/javascripts/jroutes.js"
  
  # If true the javascript routes will be generated on application startup
  #
  config.build_on_boot = false
end