require 'rubygems'
require 'sinatra'
require 'mongo'
require 'json/ext' # required for .to_json


configure do
  db = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'test')
  set :mongo_db, db[:test]
end

def insert_to_db
	file = File.read('./urlMap.json')
	data_hash = JSON.parse(file)
	# puts data_hash
	db = settings.mongo_db
	result = db.insert_many data_hash
end

# insert_to_db