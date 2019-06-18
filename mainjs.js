
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function roundNumber(number) {
   return Math.round(number);
}

function calvinToCelsius (calvin) {
  return (calvin - 273.15);
}

function notSuccess() {
  $("#found").addClass('hidden-not-found');
  $("#not-found").removeClass('hidden-not-found')
}

function success() {
  $("#not-found").addClass('hidden-not-found');
  $("#found").removeClass('hidden-not-found');
}

function getWeather (city) {
    let weatherAPI= "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=7ea00d73a83a2dc576cf68ab20a5f063"

    $.ajax({
      type: 'get',
      url: weatherAPI,

      statusCode: {
         404: function (response) {
           notSuccess();
         }
      },

      success: function(data){

        success();
        $("#your-city").html("Today's weather in " + capitalizeFirstLetter(city));
        $("#cloud").html("cloudiness: " + data.weather[0].description);
        $("#temperature").html("temperature: " + roundNumber(calvinToCelsius(data.main.temp)) +'&#x2103;');
        $("#humidity").html("humidity: " + data.main.humidity + "%");
        $("#wind").html("wind speed: " + data.wind.speed + "km/h");
      }
    });
      $(':input','#weather-form').val('');
};

$(document).ready(function() {
  $('#city-name').focus();
  $("#weather-form").submit(function(event){
    event.preventDefault();

    let cityName = $("#city-name").val();
    getWeather(cityName);
  });
});
