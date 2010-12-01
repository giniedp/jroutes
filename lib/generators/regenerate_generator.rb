module Jroutes
  class RegenerateGenerator < Rails::Generators::Base
    def generate
      Jroutes::Builder.build()
    end
  end
end