
/*
 * GET home page.
 */
var models = require('../models');


exports.index = function(req, res){
  var hotel_data;
  var restaurant_data;
  var thingsToDo_data;

  models.Hotel.find(function(err, hotel_results) {
    hotel_data = hotel_results;
    models.Restaurant.find(function(err, restaurant_results) {
      restaurant_data = restaurant_results;
      models.ThingsToDo.find(function(err, thingsToDo_results) {
        thingsToDo_data = thingsToDo_results;
        res.render('index', { 'hotels': hotel_data, 'restaurants': restaurant_data, 'things_to_do': thingsToDo_data });
      });
    });
  });
};
