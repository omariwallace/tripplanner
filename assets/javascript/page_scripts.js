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
  addDayButton();
  dayToggle();
  addItems();
  loadVisitsInDailyPlan(all_visits);
});

/************** PAGE SCRIPTS **************/

// ** Global Variables ** //
var day_no = 1;
var no_of_visits = 0;
var daily_plan = {
	1: {hotels: [], thingsToDos: [], restaurants: [], markers: []}
}
var attractions = ['hotel', 'restaurant', 'thingsToDo'];

// ** Global Functions (Primary) ** //
// Populates dropdowns with attraction items
attractions.forEach(function(attraction) {
  var all_items_object = objectTypeFinder(attraction);
  for (var i=0; i<all_items_object.length; i++) {
    $('#'+attraction+'s_dropdown').append('<option value="'+attraction+'_'+i+'" >'+all_items_object[i].place[0].name+'</option>')
  }
})

// Creates a new day key corresponding to day number in the daily plan object
function DayCreator (day_no) {
  if(!daily_plan[day_no]) {
    daily_plan[day_no] = {hotels: [], thingsToDos: [], restaurants: [], markers: []}
  }
}

// Adds a day button and creats a new key in the daily plan object
function addDayButton () {
  $('#add_day').on('click', function() {
    var no_of_days = parseInt($('#day_buttons button:last-child').text().slice(-1),10);
    console.log(no_of_days)
    // day_no = parseInt(day_no, 10);
    clearItems(day_no);
    if (no_of_days < 5) {
      $('#day_buttons').append('<button type="button" class="btn btn-default">Day '+(no_of_days+1)+'</button>');
      DayCreator(no_of_days+1)
    }
  });
}

// Toggles between days, clears and refreshes map and itinerary
function dayToggle () {
  $('#day_buttons').on('click', 'button',function() {
    // **** !!! the $(this) below allows you to access the button that was clicked !!! ****
    clearItems(window.day_no);
    window.day_no = $(this).text().slice(-1);
    // alert(day_no)
    $("#daily_itinerary h2").text("Plan for Day "+day_no);
    showItems(window.day_no);
  })
}

function addItems () {
  attractions.forEach(function(attraction) {
    $('#add_'+attraction).on('click', function() {
      // Get daily_plan object, current day no, and item added
      var daily_plan = window.daily_plan;
      var day_no = window.day_no.toString();
      var selected_value = $('#'+attraction+'s_dropdown').val().split("_")[1];
      // Select correct JSON object store variable (all_hotels, all_ttd, or all_rest)
      var all_items_object = objectTypeFinder(attraction);
      var item_object = all_items_object[selected_value];
      var item_name = item_object.place[0].name;
      // Store item in daily plan object
      daily_plan[day_no][attraction+'s'].push(item_object);
      console.log(daily_plan);
      // Add Item to Itinerary
      $('#'+attraction+'_itinerary').append('<li>'+item_name+'</li>');
      // Add map marker
      var map_marker = createMarker(item_object, item_name);
      AddMarker(map_marker, day_no);

      // Get type of button clicked in console
      var item_type = ($(this).context.id.slice(4,$(this).context.id.length));
      no_of_visits++
      var post_data = {
        attraction_id: item_object['_id'],
        attraction_type: item_type,
        day_number: day_no,
        visit_order: no_of_visits
      };
      console.log(post_data);
      writeVisitToServer(post_data);
    })
  })
}

function retrieveAttraction (visit_object) {
  var all_items_object_array = objectTypeFinder(visit_object['attraction_type'])
  var item_id_array = [];
  for (i=0; i<all_items_object_array.length; i++) {
    item_id_array.push(all_items_object_array[i]._id);
  }
  var item_position = item_id_array.indexOf(visit_object['attraction_id'])
  return all_items_object_array[item_position];
}

function loadVisitsInDailyPlan (stored_visits) {
  // console.log(stored_visits)
  // console.log(stored_visits.length)
  for (var i=0; i<stored_visits.length; i++) {
    var visit_object = retrieveAttraction(stored_visits[i]);
    // console.log(visit_object);
    // console.log(stored_visits[i])
    var visit_day = stored_visits[i]['day_number']
    var visit_type = stored_visits[i]['attraction_type']+"s";
    // console.log(stored_visits[i])
    DayCreator(visit_day)
    daily_plan[visit_day][visit_type].push(visit_object);
    var visit_name = visit_object.place[0].name
    $('#'+visit_type+'_itinerary').append('<li>'+visit_name+'</li>');
    var visit_marker = createMarker(visit_object, visit_name)
    daily_plan[visit_day]['markers'].push(visit_marker);
  }
}


// ** Global Functions (Helpers) ** //
// Clear items from itineraray and markers from map (Helper)
$('#add_hotel','#add_thingsToDo','#add_restaurant').on('click')


function clearItems(day_no) {
  // Clear itinerary list items
  attractions.forEach(function(attraction) {
    $('#'+attraction+'_itinerary li').remove();
  });
  // Clear map markers
  for (var i = 0; i < daily_plan[day_no]['markers'].length; i++ ) {
    daily_plan[day_no]['markers'][i].setMap(null);
  }
}

// Takes a specific day of a day button toggle and (1) displays the attraction in the itinerary and (2) displays the map item (Helper)
function showItems (current_day) {
  // Display attraction on itinerary
  attractions.forEach(function(attraction) {
    for (i=0; i<daily_plan[current_day][attraction+'s'].length; i++) {
      $('#'+attraction+'_itinerary').append('<li>'+daily_plan[current_day][attraction+'s'][i].place[0].name+'</li>');
    }
  })
  // Display attraction map marker
  for (i=0; i<daily_plan[day_no]['markers'].length; i++) {
    daily_plan[day_no]['markers'][i].setMap(map);
  }
}

// Uses the attraction arrray to return the right JSON variable for the data type store (Helper)
function objectTypeFinder (type) {
  switch (type) {
    case "hotel":
      return all_hotels;
      break;
    case "restaurant":
      return all_restaurants;
      break;
    case "thingsToDo":
      return all_things_to_do;
      break;
   }
}

// Takes an attraction object and uses it to create and add a marker to the map (Helper)
function createMarker (attraction_object, attraction_name) {
  // Create the marker
  var latitude = attraction_object.place[0].location[0]
  var longitude = attraction_object.place[0].location[1]
  var attractionLatlng = new google.maps.LatLng(latitude,longitude)
  var marker = new google.maps.Marker({
    position: attractionLatlng,
    title: attraction_name,
    animation: google.maps.Animation.DROP
  });
  return marker;
}

function AddMarker (map_marker, day_number) {
  // Add the marker to the map by calling setMap()
  daily_plan[day_number]['markers'].push(map_marker)
  map_marker.setMap(map);
}

function writeVisitToServer(post_data) {
  // this callback function will be called if the request succeeds.
  // the response is passed into this callback function as responseData
  var post_callback = function (responseData) {
  };
  // jQuery Ajax call
  $.post( "/visits", {'attraction_type': post_data.attraction_type, 'attraction_id': post_data.attraction_id, 'visit_order': post_data.visit_order, 'day_number': post_data.day_number}, post_callback);
}


/************************ REFACTORED CODE ************************/
// // Show type of button clicked in console ** (REFACTORED) **
// $(document).ready(function() {
//   $('#add_hotel, #add_thingsToDo, #add_restaurant').on('click', function() {
//     var daily_plan = window.daily_plan;
//     var day_no = window.day_no.toString();
//     console.log($(this).context.id.slice(4,$(this).context.id.length));
//   })
// })
  // Array storing the (1) key from the daily_plan object and the (2) related DOM element ** (REFACTORED) **
  // var itinerariries = [['hotels','#hotel_itinerary'], ['thingsToDos','#thingsToDo_itinerary'], ['restaurants','#restaurant_itinerary']];
  // for (j=0; j<itinerariries.length; j++) {
  //   var item = itinerariries[j]
  //   console.log(item);
  //   for (i=0; i<daily_plan[day_no][item[0]].length; i++) {
  //     $(item[1]).append('<li>'+daily_plan[day_no][item[0]][i].place[0].name+'</li>');
  //   }
  // }

// // Adds all hotel names to dropdown list  ** (REFACTORED) **
// for (var i=0; i<all_hotels.length; i++) {
//   $('#hotels_dropdown').append('<option value="hotel_'+i+'" >'+all_hotels[i].place[0].name+'</option>')
// }
// // Adds all things to do to dropdown list ** (REFACTORED) **
// for (var i=0; i<all_things_to_do.length; i++) {
//   $('#thingsToDos_dropdown').append('<option value="ttd_'+i+'" >'+all_things_to_do[i].place[0].name+'</option>')
// }
// // Adds all restaurant names to dropdown list ** (REFACTORED) **
// for (var i=0; i<all_restaurants.length; i++) {
//   $('#restaurants_dropdown').append('<option value="restaurant_'+i+'">'+all_restaurants[i].place[0].name+'</option>')
// }

// // Add Hotels to Itinerary ** (REFACTORED) **
// $(document).ready(function() {
//   $('#add_hotel').on('click', function() {
//     // The ".val()" method below allows you access the selected item in the '#hotels_dropdown' dropdown list (which is the select tag)
//     var daily_plan = window.daily_plan;
//     var day_no = window.day_no.toString();
//     var selected_value = $('#hotels_dropdown').val().split("_")[1];
//     var hotel_object = all_hotels[selected_value]
    // var hotel_name = hotel_object.place[0].name
    // daily_plan[day_no]['hotels'].push(hotel_object)
    // console.log(daily_plan);
    // $('#hotel_itinerary').append('<li>'+hotel_name+'</li>');
    // Add the hotel marker to the map
//     var latitude = hotel_object.place[0].location[0]
//     var longitude = hotel_object.place[0].location[1]
//     var hotelLatlng = new google.maps.LatLng(latitude,longitude)
//     var marker = new google.maps.Marker({
//       position: hotelLatlng,
//       title: hotel_name,
//       animation: google.maps.Animation.DROP
//     });
//     // Add the marker to the map by calling setMap()
//     daily_plan[day_no]['markers'].push(marker)
//     marker.setMap(map);
//   });
// // Add Things to do to Itinerary ** (REFACTORED) **
//   $('#add_thingsToDo').on('click', function() {
//     var daily_plan = window.daily_plan;
//     var day_no = window.day_no.toString();
//     var selected_value = $('#thingsToDos_dropdown').val().split("_")[1];
//     var thingsToDo_object = all_things_to_do[selected_value]
//     var thingsToDo_name = thingsToDo_object.place[0].name
//     $('#thingsToDo_itinerary').append('<li>'+thingsToDo_name+'</li>');
//     daily_plan[day_no]['thingsToDos'].push(thingsToDo_object)
//     console.log(daily_plan);
//     var latitude = thingsToDo_object.place[0].location[0]
//     var longitude = thingsToDo_object.place[0].location[1]
//     var thingsToDoLatlng = new google.maps.LatLng(latitude,longitude)
//     var marker = new google.maps.Marker({
//       position: thingsToDoLatlng,
//       title: thingsToDo_name,
//       animation: google.maps.Animation.DROP
//     });
//     // Add the marker to the map by calling setMap()
//     daily_plan[day_no]['markers'].push(marker)
//     marker.setMap(map);
//   });
// // Add Restaurants to Itinerary ** (REFACTORED) **
//   $('#add_restaurant').on('click', function() {
//     var daily_plan = window.daily_plan;
//     var day_no = window.day_no.toString();
//     var selected_value = $('#restaurants_dropdown').val().split("_")[1];
//     var restaurants_object = all_restaurants[selected_value]
//     var restaurants_name = restaurants_object.place[0].name
//     $('#restaurant_itinerary').append('<li>'+restaurants_name+'</li>');
//     daily_plan[day_no]['restaurants'].push(restaurants_object)
//     console.log(daily_plan);
//     var latitude = restaurants_object.place[0].location[0]
//     var longitude = restaurants_object.place[0].location[1]
//     var restaurantsLatlng = new google.maps.LatLng(latitude,longitude)
//     var marker = new google.maps.Marker({
//       position: restaurantsLatlng,
//       title: restaurants_name,
//       animation: google.maps.Animation.DROP
//     });
//     // Add the marker to the map by calling setMap()
//     daily_plan[day_no]['markers'].push(marker)
//     marker.setMap(map);
//   })
// });
