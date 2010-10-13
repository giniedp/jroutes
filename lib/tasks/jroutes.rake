require 'rake'

namespace :jroutes do
  desc "generates javascript routes"
  task :generate => :environment do 
    puts "generating jRoutes..."
    
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
    
    js_source = File.join(File.dirname(__FILE__), '..', 'javascripts', 'jroutes.js')
    js_target = Rails.root.join('public', 'javascripts', 'jroutes.js')
    js_min = Rails.root.join('public', 'javascripts', 'jroutes.min.js')
    
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
    
    puts "...done"
  end
end
