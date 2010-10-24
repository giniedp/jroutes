# enables rake tasks in the final application
Dir["#{Gem.searcher.find('fancygrid').full_gem_path}/**/tasks/*.rake"].each { |ext| load ext }

module Jroutes

  class Railtie < Rails::Railtie
    initializer "jroutes.initialize" do |app|
      # nothing to do
    end
  end
end