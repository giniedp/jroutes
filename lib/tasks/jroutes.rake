require 'rake'
require 'net/http'
require 'uri'

js_source = File.join(File.dirname(__FILE__), '..', 'javascripts', 'jroutes.js')
js_target = Rails.root.join('public', 'javascripts', 'jroutes.js')
js_min = Rails.root.join('public', 'javascripts', 'jroutes.min.js')
    
namespace :jroutes do
  desc "generates javascript routes"
  task :generate => :environment do 
    puts "- generating jRoutes"
    
    Rails.application.reload_routes!
    all_routes = Rails.application.routes.routes
    
    routes = all_routes.collect do |route|
      reqs = route.requirements.dup
      reqs[:to] = route.app unless route.app.class.name.to_s =~ /^ActionDispatch::Routing/
      reqs = reqs.empty? ? "" : reqs.inspect
      {:name => route.name.to_s, :path => route.path}
    end
    
    routes.reject! { |r| r[:path] =~ %r{/rails/info/properties} } # Skip the route if it's internal info route
    routes.reject! { |r| r[:name].blank? }
    lines = routes.map{ |r| "Router.pushRoute('#{r[:name]}', '#{r[:path]}')" }.uniq!
    

    
    File.delete(js_target) if File.exists?(js_target)
    
    File.open(js_target, 'w') do |f|
      File.open(js_source, "r") do |file|
        while (line = file.gets)
          f.print(line)
        end
      end
      f.print("\n")
      f.print lines.join("\n")
    end
    
    puts "- routes generated at #{js_target}"
  end
  
  desc "generates minified javascript routes"
  task :minified => [:environment, :generate] do 
    
    lines = []
    File.open(js_target, 'r') do |f|
      while (line = f.gets)
        lines << line
      end
    end
    
    puts "- minify javascript using 'http://closure-compiler.appspot.com/compile'"
    
    url = URI.parse('http://closure-compiler.appspot.com/compile')
    req = Net::HTTP::Post.new(url.path)
    req.set_form_data({
      :compilation_level => "SIMPLE_OPTIMIZATIONS",
      :output_format => "text",
      :output_info => "compiled_code",
      :js_code => lines.join("")
    })
    res = Net::HTTP.new(url.host, url.port).start {|http| http.request(req) }
    case res
    when Net::HTTPSuccess, Net::HTTPRedirection
      File.delete(js_min) if File.exists?(js_min)
      File.open(js_min, 'w') do |f|
        f.print(res.body)
      end
      puts "- routes minified to #{js_min}"
    else
      puts "- error during google closure request"
    end
  end
end
