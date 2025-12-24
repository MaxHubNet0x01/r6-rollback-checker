source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.3.4'

gem 'jekyll', '~> 4.3.4'
gem 'jekyll-remote-theme', '~> 0.4.3'
gem 'jekyll-seo-tag', '~> 2.8.0'

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem 'wdm', '>= 0.1.0' if Gem.win_platform?