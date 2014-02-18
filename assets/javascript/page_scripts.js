/** Google Maps Import **/
function initialize_gmaps() {
  // initialize new google maps LatLng object
  var myLatlng = new google.maps.LatLng(-34.397, 150.644);
    // set the map options hash
  var mapOptions = {
    center: myLatlng,
    zoom: 8,
    // mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  // get the maps div's HTML obj
  var map_canvas_obj = document.getElementById("map-canvas");

  // initialize a new Google Map with the options
  var map = new google.maps.Map(map_canvas_obj, mapOptions);

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

$(document).ready(function() {
  $('#add_hotel').on('click', function() {
    var selected_value = $('#hotels_list').val().split("_")[1];
    // The ".val()" method above allows you access the selected item in the '#hotels_list' dropdown list (which is the select tag)
    $('#hotel_itinerary').append('<li>'+all_hotels[selected_value].place[0].name+'</li>');
    daily_plan['hotels'].push(all_hotels[selected_value])
    console.log(daily_plan);
  });
  $('#add_thing_to_do').on('click', function() {
    var selected_value = $('#things_to_do_list').val().split("_")[1];
    $('#things_to_do_itinerary').append('<li>'+all_things_to_do[selected_value].place[0].name+'</li>');
    daily_plan['things_to_do'].push(all_things_to_do[selected_value])
    console.log(daily_plan);
  });
  $('#add_restaurant').on('click', function() {
    var selected_value = $('#restaurants_list').val().split("_")[1];
    $('#restaurant_itinerary').append('<li>'+all_restaurants[selected_value].place[0].name+'</li>');
    daily_plan['restaurants'].push(all_restaurants[selected_value])
    console.log(daily_plan);
  })
});
