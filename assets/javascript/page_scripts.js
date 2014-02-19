/** Google Maps Import **/
function initialize_gmaps() {
  // initialize new google maps LatLng object
  var myLatlng = new google.maps.LatLng(40.705786,-74.007672);
    // set the map options hash
  var mapOptions = {
    center: myLatlng,
    zoom: 12,
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

// Adding a day
var day_no = 1;
$(document).ready(function() {
  DayCreator(day_no)
  $('#add_day').on('click', function() {
    day_no = parseInt(day_no, 10);
    clearItems(day_no);
    if (day_no < 5) {
      $('#day_buttons').append('<button type="button" class="btn btn-default">Day '+(day_no+1)+'</button>');
      day_no += 1;
    }
    DayCreator(day_no)
  });
});

/** Day Button Functions **/
$(document).ready(function() {
  $('#day_buttons').on('click', 'button',function() {
    // !!! the $(this) allows you to access the button that was clicked !!!
    clearItems(window.day_no);
    window.day_no = $(this).text().slice(-1);
    alert(window.day_no)
    $("#daily_itinerary h2").text("Plan for Day "+day_no);
    showItems(window.day_no);
  })
})

/** Add Itinerary Item Functions **/
var daily_plan = {};
var DayCreator = function (day_no) {
  daily_plan[day_no] = {hotels: [], things_to_do: [], restaurants: [], markers: []}
}

/** {{TBD}} Create a general type array that will be used for all general functions !!! **/
// hotel, restaurant, things_to_do

/** Clear Items Functionality **/
function clearItems(day_no) {
  $("#hotel_itinerary li").remove()
  $("#things_to_do_itinerary li").remove()
  $("#restaurant_itinerary li").remove()
  for (var i = 0; i < daily_plan[day_no]['markers'].length; i++ ) {
    daily_plan[day_no]['markers'][i].setMap(null);
  }
}

/** Add Items on Day **/
function showItems (day_no) {
  // Array storing the (1) key from the daily_plan object and the (2) related DOM element
  var itinerariries = [['hotels','#hotel_itinerary'], ['things_to_do','#things_to_do_itinerary'], ['restaurants','#restaurant_itinerary']];
  for (j=0; j<itinerariries.length; j++) {
  	var item = itinerariries[j]
  	console.log(item);
    for (i=0; i<daily_plan[day_no][item[0]].length; i++) {
      $(item[1]).append('<li>'+daily_plan[day_no][item[0]][i].place[0].name+'</li>');
    }
  }
  for (i=0; i<daily_plan[day_no]['markers'].length; i++) {
    daily_plan[day_no]['markers'][i].setMap(map);
  }
}


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

// {{TBD}} Show Item in Itinerary and Store in Daily Plan Object
function storeAndShow () {}


// Adds a selected item to the database in a visits
// function writeVisitToServer(attraction_object) {
//   var post_data = {
//     attraction_id: attraction_object['_id'],
//     attraction_type: type_of_place
//     day_number: current_day,
//     visit_order: visit_order
//   };

//   // this callback function will be called if the request succeeds.
//   // the response is passed into this callback function as responseData

//   var post_callback = function (responseData) {
//     // responseData.visit_id will be the id of database Visit object
//   };

//   // jQuery Ajax call
//   $.post( "/visits", post_data, post_callback);
// }

// Add Attraction to Itinerary and Map on Specific Day
$(document).ready(function() {
  $('#add_hotel, #add_thing_to_do, #add_restaurant').on('click', function() {
    var daily_plan = window.daily_plan;
    var day_no = window.day_no.toString();
    console.log($(this).context.id.slice(4,$(this).context.id.length));
  })
})



// Create Marker (function that takes in lat, long, and title)

// Add Hotels to Itinerary
$(document).ready(function() {
  $('#add_hotel').on('click', function() {
    // The ".val()" method below allows you access the selected item in the '#hotels_list' dropdown list (which is the select tag)
    var daily_plan = window.daily_plan;
    var day_no = window.day_no.toString();
    var selected_value = $('#hotels_list').val().split("_")[1];
    var hotel_object = all_hotels[selected_value]
    var hotel_name = hotel_object.place[0].name
    daily_plan[day_no]['hotels'].push(hotel_object)
    console.log(daily_plan);
    $('#hotel_itinerary').append('<li>'+hotel_name+'</li>');
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
    daily_plan[day_no]['markers'].push(marker)
    marker.setMap(map);
  });
// Add Things to do to Itinerary
  $('#add_thing_to_do').on('click', function() {
    // The ".val()" method below allows you access the selected item in the '#hotels_list' dropdown list (which is the select tag)
    var daily_plan = window.daily_plan;
    var day_no = window.day_no.toString();
    var selected_value = $('#things_to_do_list').val().split("_")[1];
    var things_to_do_object = all_things_to_do[selected_value]
    var things_to_do_name = things_to_do_object.place[0].name
    // window.daily_plan[day_no]['things_to_do'].push(things_to_do_object)
    $('#things_to_do_itinerary').append('<li>'+things_to_do_name+'</li>');
    daily_plan[day_no]['things_to_do'].push(things_to_do_object)
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
    daily_plan[day_no]['markers'].push(marker)
    marker.setMap(map);
  });
// Add Restaurants to Itinerary
  $('#add_restaurant').on('click', function() {
    // The ".val()" method below allows you access the selected item in the '#hotels_list' dropdown list (which is the select tag)
    var daily_plan = window.daily_plan;
    var day_no = window.day_no.toString();
    var selected_value = $('#restaurants_list').val().split("_")[1];
    var restaurants_object = all_restaurants[selected_value]
    var restaurants_name = restaurants_object.place[0].name
    $('#restaurant_itinerary').append('<li>'+restaurants_name+'</li>');
    daily_plan[day_no]['restaurants'].push(restaurants_object)
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
    daily_plan[day_no]['markers'].push(marker)
    marker.setMap(map);
  })
});
