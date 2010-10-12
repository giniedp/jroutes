require 'rake'

namespace :jroutes do
  desc "generate"
  task :generate do
    #
    # copy the jroutes.js file to public javascripts
    #
    system("rm #{Jroutes::JS_TARGET}")
    system("cp #{Jroutes::JS_SOURCE} #{Jroutes::JS_TARGET}")
    
    puts "generating routes..."
    #
    # run the rake task 'rake routes' and store output in temp file
    # then parse the tempfile reading all anmed routes into an array of lines
    #

    file = Tempfile.new("routes")
    system("rake routes > #{file.path}")
    
    named_routes = {}
    File.open(file.path, "r") do |file|
      while (line = file.gets)
        next unless (line.match(/\{:controller=>\"\w+\", :action=>\"\w*\"\}\s*$/))
        line.gsub!(/\{:controller=>\"\w+\", :action=>\"\w*\"\}\s*$/, "")
        line = line.split(" ")
        name = line[0]
        path = (line.length == 3 ? line[2] : line[1])
        named_routes[name] = path
      end
    end
    lines = named_routes.map{ |k, v| "Router.pushRoute('#{k}', '#{v}')" }

    puts "writing routes..."
    #
    # append the named routes to javascript file
    #
    File.open(Jroutes::JS_TARGET, 'a') do |f|
      f.print lines.join("\n")
    end
  end
end
