module Jroutes
  pwd = File.expand_path(File.dirname(__FILE__))

  mattr_accessor :source_path
  @@source_path = File.join(File.dirname(__FILE__), 'javascripts', 'jroutes.js')
    
  mattr_accessor :output_path
  @@output_path = "public/javascripts/jroutes.js"

  mattr_accessor :build_on_boot
  @@build_on_boot = false
  
  def self.setup
    yield self
  end
  
  class Railtie < Rails::Railtie
    generators do
      require File.join(File.dirname(__FILE__), "generators", "install_generator.rb")
      require File.join(File.dirname(__FILE__), "generators", "regenerate_generator.rb")
    end
    
    initializer "jroutes.initialize" do |app|
      # nothing to do
    end
    
    config.after_initialize do |app|
      if (Jroutes.build_on_boot)
        Jroutes::Builder.build()
      end
    end
  end
  
  class Builder
    def self.build
      Rails.application.reload_routes!
      all_routes = Rails.application.routes.routes
      
      routes = []
      all_routes.each do |route|
        reqs = route.requirements.dup
        reqs[:to] = route.app unless route.app.class.name.to_s =~ /^ActionDispatch::Routing/
        reqs = reqs.empty? ? "" : reqs.inspect
        routes << { :name => route.name.to_s, :path => route.path }
      end
      
      # Skip the route if it's internal info route
      routes.reject! { |r| r[:path] =~ %r{/rails/info/properties} } 
      # Skip all unnamed routes
      routes.reject! { |r| r[:name].blank? }
      
      js_source = Jroutes.source_path
      js_target = Jroutes.output_path
      lines = []
      lines << "(function(){"
      lines << "  var Router = this.Router;"
      lines += routes.map{ |r| "  Router.pushRoute('#{r[:name]}', '#{r[:path]}');" }.uniq
      lines << "}());"
      
      File.delete(js_target) if File.exists?(js_target)
      
      File.open(js_target, 'w') do |f|
        File.open(js_source, "r") do |file|
          while (line = file.gets)
            f.print(line)
          end
        end
        f.print("\n")
        f.print(lines.join("\n"))
      end
    end
  end
end