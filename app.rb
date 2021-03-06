require 'rubygems'
require 'sinatra'
require 'mongo'
require 'json/ext' # required for .to_json
require 'securerandom'

Tilt.register Tilt::ERBTemplate, 'html.erb'

configure do
  db = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'pixel')  
  set :mongo_db, db[:pixel]
end

get '/collections/?' do
  content_type :json
  settings.mongo_db.database.collection_names.to_json
end

helpers do
  # a helper method to turn a string ID
  # representation into a BSON::ObjectId
  def object_id val
    begin
      BSON::ObjectId.from_string(val)
    rescue BSON::ObjectId::Invalid
      nil
    end
  end

  def document_by_id id
    id = object_id(id) if String === id
    if id.nil?
      {}.to_json
    else
      document = settings.mongo_db.find(:_id => id).to_a.first
      (document || {}).to_json
    end
  end
end

# list all documents in the test collection
get '/documents/?' do
  content_type :json
  settings.mongo_db.find.to_a.to_json
end

# find a document by its ID
get '/document/:id/?' do
  content_type :json
  document_by_id(params[:id])
end

get '/newurldata/:url' do
  content_type :json
  urlParams = params
  pixelId = SecureRandom.hex
  urlHash = Hash.new
  urlHash[pixelId] = urlParams
  urlHash.to_json
  # result = db.insert_one urlHash.to_json
end

post '/newpixel/?' do
  content_type :json
  db = settings.mongo_db
  urlParams = params[:url]
  pixelId = SecureRandom.hex
  urlHash = Hash.new
  urlHash[pixelId] = urlParams
  result = db.insert_one urlHash
  db.find(:_id => result.inserted_id).to_a.first.to_json
end

get '/pixelgenerator' do 
  erb :pixel_generator
end


