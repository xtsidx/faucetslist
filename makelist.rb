require 'nokogiri'
require 'open-uri'
require 'cgi'
require 'yaml'
require 'erubis'
require 'optparse'

noref = false

OptionParser.new do |opts|
  opts.banner = "Usage: makelist.rb [options]"

  opts.on("-r", "--noreferal", "Make faucet list without referal") do |v|
    noref = true
  end
end.parse!

referals = YAML.load_file('referals.yml')
addressbook = YAML.load_file('addressbook.yml')

lists = {}

referals.each do |c|
    coin = c[0]
    ref = c[1]
    p "Get #{coin} faucet list..."
    
    page = Nokogiri::HTML(open("https://faucetbox.com/en/list/#{coin}"))
    
    # faucet list [[name, url, urlid], [name, url, urlid], ...]
    list = page.css('.faucets-list tr td:nth-child(2) a').map do |a|
        urlid = CGI.parse(URI.parse(a[:href]).query)['url'][0]
        url = urlid
        unless noref
            uri = URI.parse(url)
            params = CGI.parse(uri.query || '')
            params['r'] = ref
            uri.query = URI.encode_www_form params
            url = uri.to_s
        end
        
        [a.content, url, urlid]
    end
    
    p "#{list.length} faucets"
    
    lists[coin] = list
end

p "Make index.html"

input = File.read('template.rhtml')
html = Erubis::Eruby.new(input).result(lists: lists, addressbook: addressbook)
File.write('index.html', html)

p "Done!"
