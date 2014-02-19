var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tripplanner');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var Place,
    Hotel,
    ThingsToDo,
    Restaurant,
    Visit;

var Schema = mongoose.Schema;
var ObjectID = Schema.Types.ObjectId;

var placeSchema = new Schema({
  name: String,
  address: String,
  city: String,
  state: String,
  phone: String,
  location: [Number, Number] // latitude, longitude
});

var hotelSchema = new Schema({
  place: [placeSchema],
  num_stars: Number, // no. of start from 1 - 5
  amenities: String // csv list
});

var thingsToDoSchema = new Schema({
  place: [placeSchema],
  age_range: String
});

var restaurantSchema = new Schema({
  place: [placeSchema],
  cuisine: String,
  price: Number // integer fro 1-5 for $'s
});

var visitSchema = new Schema({
  attraction_type: String, // hotel, thingtodo, restaurant
  attraction_id: ObjectID, // database id of attraction object
  visit_order: Number, // integer ordering of the item in the day
  day_number: Number
});

Place = mongoose.model('Place', placeSchema);

Hotel = mongoose.model('Hotel', hotelSchema);

ThingsToDo = mongoose.model('ThingsToDo', thingsToDoSchema);

Restaurant = mongoose.model('Restaurant', restaurantSchema);

Visit = mongoose.model('Visit', visitSchema);

module.exports = {'Place': Place, 'Hotel': Hotel, 'ThingsToDo': ThingsToDo, 'Restaurant':Restaurant, 'Visit': Visit};