require 'securerandom'

def addToUrlList url 
	urlKey = url
	urlValue = SecureRandom.base64
	urlHash = Hash.new
	urlHash[urlKey] = urlValue
	db = settings.mongo_db
	result = db.insert_many data_hash
end
