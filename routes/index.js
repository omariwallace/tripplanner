
/*
 * GET home page.
 */
var models = require('../models');


exports.index = function(req, res){
  var hotel_data;
  var restaurant_data;
  var thingsToDo_data;
  var visits_data

  models.Hotel.find(function(err, hotel_results) {
    hotel_data = hotel_results;
    models.Restaurant.find(function(err, restaurant_results) {
      restaurant_data = restaurant_results;
      models.ThingsToDo.find(function(err, thingsToDo_results) {
        thingsToDo_data = thingsToDo_results;
        models.Visit.find(function(err, visits_results) {
          visits_data = visits_results;
          res.render('index', { 'hotels': hotel_data, 'restaurants': restaurant_data, 'things_to_do': thingsToDo_data, 'visits': visits_data });
        });
      });
    });
  });
};
exports.test_index = function(req, res) {
	res.render("test.html");
};
exports.visit_create = function (req, res) {
  var attraction_type = req.body.attraction_type;
  var attraction_id = req.body.attraction_id;
  var visit_order = req.body.visit_order
  var day_number = req.body.day_number
  models.Visit.create({'attraction_type': attraction_type, 'attraction_id': attraction_id, 'visit_order': visit_order, 'day_number': day_number}, function(err, visit_data) {
    console.log(visit_data);
    // Node function that sends a response to the request that the
    res.redirect('/');
    // Post has to send something back to the server (node); and the server has to signal that the response to the post has ended
  })
}
/* Visits Schema
  attraction_type: String, // hotel, thingtodo, restaurant
  attraction_id: ObjectID, // database id of attraction object
  visit_order: Number, // integer ordering of the item in the day
  day_number: Number
  */

exports.visit_index = function () {

}