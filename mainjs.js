function getWeather (city) {
    let weatherAPI= "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=7ea00d73a83a2dc576cf68ab20a5f063"
    $.get(weatherAPI,function(data){
      console.log(data);

      $("#cloud").html("cloudiness: " + data.weather[0].description);
    })
};

$( document ).ready(function() {
  $("#weather-form").submit(function(event){
    event.preventDefault();

    let cityName = $("#city-name").val();
    getWeather(cityName);
  });
});
