source "https://rubygems.org"

repo = ENV["REPO"] || "https://github.com/jekyll/jekyll.git"

if ENV["REF"]
  gem "jekyll", git: repo, ref: ENV["REF"]
elsif ENV["PR"]
  gem "jekyll", git: repo, ref: "refs/pull/#{ENV['PR']}/head"
else
  gem "jekyll", git: repo, branch: "master"
end

gem "jekyll-sass-converter"
gem "kramdown"
gem "jekyll-commonmark-ghpages"
gem "jekyll-redirect-from"
gem "jekyll-sitemap"
gem "jekyll-feed"
gem "jekyll-gist"
gem "jekyll-paginate"
gem "jekyll-coffeescript"
gem "jekyll-seo-tag"
gem "jekyll-github-metadata"
gem "jekyll-avatar"
gem "jekyll-remote-theme"
gem "jemoji"
gem "jekyll-mentions"
gem "jekyll-relative-links"
gem "jekyll-optional-front-matter"
gem "jekyll-readme-index"
gem "jekyll-default-layout"
gem "jekyll-titles-from-headings"
gem "jekyll-swiss"
gem "jekyll-theme-primer"
gem "jekyll-theme-architect"
gem "jekyll-theme-cayman"
gem "jekyll-theme-dinky"
gem "jekyll-theme-hacker"
gem "jekyll-theme-leap-day"
gem "jekyll-theme-merlot"
gem "jekyll-theme-midnight"
gem "jekyll-theme-minimal"
gem "jekyll-theme-modernist"
gem "jekyll-theme-slate"
gem "jekyll-theme-tactile"
gem "jekyll-theme-time-machine"

gem "jekyll-include-cache" # DirtyF/frank.taillandier.me
gem "jekyll-last-modified-at" # DirtyF/frank.taillandier.me
gem "jekyll-tidy" # DirtyF/frank.taillandier.me
gem "jekyll-cloudinary", group: :jekyll_plugins # DirtyF/frank.taillandier.me
gem "classifier-reborn" # DirtyF/frank.taillandier.me

gem "redcarpet" # 18F/federalist-docs
gem "uswds-jekyll" # 18F/federalist-docs
gem "jekyll_pages_api_search", group: :jekyll_plugins # 18F/federalist-docs

group :dev do
  gem "rubocop", "~> 0.56.0"
end
