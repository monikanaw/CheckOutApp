//the weather

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

function notSelectedCity() {
  $("#notSelectedCity").removeClass('hidden-not-found');
}

function SelectedCity() {
  $("#notSelectedCity").addClass('hidden-not-found');
}

function notSelectedDay() {
  $("#notSelectedDay").removeClass('hidden-not-found');
}

function SelectedDay() {
  $("#notSelectedDay").addClass('hidden-not-found');
}

function foundCity() {
  $("#found").removeClass('hidden-not-found');
}

function notFoundCity(){
  $("#found").addClass('hidden-not-found');
}

function clearInput() {
  $('input','#form-weather').val('');
  $('select','#form-weather').val('selected');
}

function temperaturesArray(data) {
   let tempInK = [];
   for(let i = 0; i < data.list.length; i++){
     tempInK.push(data.list[i].main.temp)
   };
    return tempInK;
};


function temperaturesArrayToCelsius(data){
    let temperaturesinCelsius = [];
    temperaturesArray(data).map(function(element){
    let changeToCelsius = calvinToCelsius(element);
    temperaturesinCelsius.push(changeToCelsius)
    });
  return(temperaturesinCelsius);
};

function temperaturesArrayinCelsiusRounded(data){
  let roundedTemperaturesCelsius = [];
   temperaturesArrayToCelsius(data).map(function(element){
     let changeToRoundedCelsius = roundNumber(element);
      roundedTemperaturesCelsius.push(changeToRoundedCelsius)
   });
  return(roundedTemperaturesCelsius);
};

function getDateFromApi(data) {
     let DateFromApi = [];
     for(let i = 0; i < data.list.length; i++){
       DateFromApi.push(data.list[i].dt_txt)
     };
      return DateFromApi;
  };




function getWeatherCurrent(city) {
    let weatherAPI= "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=7ea00d73a83a2dc576cf68ab20a5f063"

    $.ajax({
      type: 'get',
      url: weatherAPI,

      statusCode: {
         404: function(response) {
           notSuccess();
         }
      },

      success: function(data){

        success();
        foundCity();
        $("#your-city").html("Today's weather in " + capitalizeFirstLetter(city));
        $("#cloud").html("cloudiness: " + data.weather[0].description);
        $("#temperature").html("temperature: " + roundNumber(calvinToCelsius(data.main.temp)) +'&#x2103;');
        $("#humidity").html("humidity: " + data.main.humidity + "%");
        $("#wind").html("wind speed: " + data.wind.speed + "km/h");
      }
    });
    clearInput()
};

function getWeatherForecast(city) {
    let weatherAPI= "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid=7ea00d73a83a2dc576cf68ab20a5f063"

    $.ajax({
      type: 'get',
      url: weatherAPI,

      statusCode: {
         404: function(response) {
           notSuccess();
         }
      },

      success: function(data){
        success();
        foundCity();
        console.log(temperaturesArrayinCelsiusRounded(data));
        console.log(getDateFromApi(data));
        chartForWeather(data);
      }
    });
    clearInput()
};


$(document).ready(function() {
  $('#inputCity').focus();
  $("#form-weather").submit(function(event){
    event.preventDefault();
    let city = $("#inputCity").val();


    if (city === "") {
      success();
      notSelectedCity();
      notFoundCity();
    }
    else {
      SelectedCity()
      let card = document.getElementById("inputState");
      if(card.selectedIndex == 0) {
        success();
        notSelectedDay();
        notFoundCity();
      }
      else if (card.selectedIndex == 1) {
         success();
         SelectedDay();
         getWeatherCurrent(city);
      }
      else {
        getWeatherForecast(city);
      }
    };
  });
});

function chartForWeather(x){
    $(document).ready(function() {
      let myChart = document.getElementById('myChart').getContext('2d');

      Chart.defaults.globalFontFamily= 'Ariel';
      Chart.defaults.globalFontSize= 15;
      Chart.defaults.globalFontColor= '#fff';


      let weatherChart = new Chart (myChart, {
        type:'line',
        data: {
          labels:['monika', 'wroclaw', 'warsaw', 'krakow', 'zosia', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
          datasets:[{
            fill: false,
            label:'population',
            data: temperaturesArrayinCelsiusRounded(x)
          }]
        },
        options: {
          title: {
            display: true,
            text: 'Forecast for five days',
            fontSize: 25
          },
          legend: {
            position: 'right'
          }
        }
      });

    });
}
