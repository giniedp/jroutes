module Jroutes
  class InstallGenerator < Rails::Generators::Base
    def copy_initializer
      plugin_path = File.join(File.dirname(__FILE__), "../templates/jroutes.rb")
      rails_path = Rails.root.join('config/initializers/jroutes.rb')
      copy_file(plugin_path, rails_path)
    end
  end
end