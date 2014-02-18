/** Google Maps Import **/
function initialize_gmaps() {
  // initialize new google maps LatLng object
  var myLatlng = new google.maps.LatLng(40.705786,-74.007672);
    // set the map options hash
  var mapOptions = {
    center: myLatlng,
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  // get the maps div's HTML obj
  var map_canvas_obj = document.getElementById("map-canvas");

  // initialize a new Google Map with the options
  map = new google.maps.Map(map_canvas_obj, mapOptions); // took off the 'var' def in from of map to make map a global variable available to all functions!!

  // Add the marker to the map
  var marker = new google.maps.Marker({
    position: myLatlng,
    title:"Hello World!"
  });

  // Add the marker to the map by calling setMap()
  marker.setMap(map);
}

$(document).ready(function() {
   initialize_gmaps();
});

/** Day Button Functions **/
var day_no = 1;
$(document).ready(function() {
    $('#add_day').on('click', function() {
      if (day_no < 3) {
        $('#day_buttons').append('<button type="button" class="btn btn-default">Day'+(day_no+1).toString()+'</button>');
        day_no += 1;
      }
    });
});

/** Drop-down functions **/
// Adds all hotel names to dropdown list
for (var i=0; i<all_hotels.length; i++) {
  $('#hotels_list').append('<option value="hotel_'+i+'" >'+all_hotels[i].place[0].name+'</option>')
}
// Adds all things to do to dropdown list
for (var i=0; i<all_things_to_do.length; i++) {
  $('#things_to_do_list').append('<option value="ttd_'+i+'" >'+all_things_to_do[i].place[0].name+'</option>')
}
// Adds all restaurant names to dropdown list
for (var i=0; i<all_restaurants.length; i++) {
  $('#restaurants_list').append('<option value="restaurant_'+i+'">'+all_restaurants[i].place[0].name+'</option>')
}

/** Add Itinerary Item Functions **/
var daily_plan = {
  hotels: [],
  things_to_do: [],
  restaurants: [],
}
// Add Hotels to Itinerary
$(document).ready(function() {
  $('#add_hotel').on('click', function() {
    // The ".val()" method below allows you access the selected item in the '#hotels_list' dropdown list (which is the select tag)
    var selected_value = $('#hotels_list').val().split("_")[1];
    daily_plan['hotels'].push(hotel_object)
    var hotel_object = all_hotels[selected_value]
    var hotel_name = hotel_object.place[0].name
    $('#hotel_itinerary').append('<li>'+hotel_name+'</li>');
    console.log(daily_plan);
    // Add the hotel marker to the map
    var latitude = hotel_object.place[0].location[0]
    var longitude = hotel_object.place[0].location[1]
    var hotelLatlng = new google.maps.LatLng(latitude,longitude)
    var marker = new google.maps.Marker({
      position: hotelLatlng,
      title: hotel_name,
      animation: google.maps.Animation.DROP
    });
    // Add the marker to the map by calling setMap()
    marker.setMap(map);
  });
// Add Things to do to Itinerary
  $('#add_thing_to_do').on('click', function() {
    var selected_value = $('#things_to_do_list').val().split("_")[1];
    var things_to_do_object = all_things_to_do[selected_value]
    var things_to_do_name = things_to_do_object.place[0].name
    daily_plan['things_to_do'].push(things_to_do_object)
    $('#things_to_do_itinerary').append('<li>'+things_to_do_name+'</li>');
    console.log(daily_plan);
    var latitude = things_to_do_object.place[0].location[0]
    var longitude = things_to_do_object.place[0].location[1]
    var thingsToDoLatlng = new google.maps.LatLng(latitude,longitude)
    var marker = new google.maps.Marker({
      position: thingsToDoLatlng,
      title: things_to_do_name,
      animation: google.maps.Animation.DROP
    });
    // Add the marker to the map by calling setMap()
    marker.setMap(map);
  });
// Add Restaurants to Itinerary
  $('#add_restaurant').on('click', function() {
    var selected_value = $('#restaurants_list').val().split("_")[1];
    var restaurants_object = all_restaurants[selected_value]
    var restaurants_name = restaurants_object.place[0].name
    $('#restaurant_itinerary').append('<li>'+restaurants_name+'</li>');
    daily_plan['restaurants'].push(restaurants_object)
    console.log(daily_plan);
    var latitude = restaurants_object.place[0].location[0]
    var longitude = restaurants_object.place[0].location[1]
    var restaurantsLatlng = new google.maps.LatLng(latitude,longitude)
    var marker = new google.maps.Marker({
      position: restaurantsLatlng,
      title: restaurants_name,
      animation: google.maps.Animation.DROP
    });
    // Add the marker to the map by calling setMap()
    marker.setMap(map);
  })
});
