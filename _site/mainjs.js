// //four images about weather
// $(document).ready(function() {
//   var hoverOrClick = function () {
//     $(this).children('div').toggleClass("hidden");
//     $(this).children('p').toggleClass("hidden");
//   }
//   $('.background-phenomen-weather').hover(hoverOrClick);
//   $('.background-phenomen-weather').click(hoverOrClick);
// });

// //four images about weather
$(document).ready(function() {
  var hoverOrClick = function () {
    $(this).children('.phenomen').toggleClass("hidden");
    $(this).children('.title-of-weather').toggleClass("hidden");
  }
  $('.background-phenomen-weather').hover(hoverOrClick);
  $('.background-phenomen-weather').on('touchstart', function() { (hoverOrClick)
  });
  $('.background-phenomen-weather').on('touchend', function() { (hoverOrClick)
  });

});

//the weather

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

function roundNumber(number) {
   return Math.round(number);
};

function calvinToCelsius (calvin) {
  return (calvin - 273.15);
};

function lackOfThisCity() {
  $("#notCityExist").removeClass('hidden')
};

function thisCityExist() {
  $("#notCityExist").addClass('hidden');
};

function notSelectedCity() {
  $("#notSelectedCity").removeClass('hidden');
};

function SelectedCity() {
  $("#notSelectedCity").addClass('hidden');
};

function notSelectedKindOfWeather() {
  $("#notSelectedWhichWeather").removeClass('hidden');
};

function SelectedKindOfWeather() {
  $("#notSelectedWhichWeather").addClass('hidden');
};

function showingCurrentWeather() {
  $("#foundCityCurrent").removeClass('hidden');
};

function hidingCurrentWeather(){
  $("#foundCityCurrent").addClass('hidden');
};

function hidingForecastWeather() {
  $("#foundCityForecast").addClass('hidden');
};

function showingForecastWeather() {
  $("#foundCityForecast").removeClass('hidden');
};

function clearInput() {
  $('input','#formWeather').val('');
  $('select','#formWeather').val('selected');
};

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

function removingCharactersFromString(data) {
  let reducedDate = []
  getDateFromApi(data).forEach(function(element){
    reducedDate.push(element.slice(5, -3));
  })
  return reducedDate;
};

function getMaxValue(data){
   let maxTemp = Math.max.apply(null, temperaturesArrayinCelsiusRounded(data));
    let roundedMaxTemp = Math.ceil(maxTemp / 10) * 10;
     return roundedMaxTemp;
};

function getMinValue(data){
   let minTemp = Math.min.apply(null, temperaturesArrayinCelsiusRounded(data));
    let roundedMinTemp = Math.floor(minTemp / 10) * 10;
    return roundedMinTemp;
};

function speedWindArray(data) {
   let forecastSpeedWind = [];
   for(let i = 0; i < data.list.length; i++){
     forecastSpeedWind.push(data.list[i].wind.speed)
   };
    return forecastSpeedWind;
};

function pressureArray(data) {
   let forecastPressure = [];
   for(let i = 0; i < data.list.length; i++){
     forecastPressure.push(data.list[i].main.pressure)
   };
    return forecastPressure;
};

function getWeatherCurrent(city) {
    let weatherAPI= "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=7ea00d73a83a2dc576cf68ab20a5f063"

    $.ajax({
      type: 'get',
      url: weatherAPI,

      statusCode: {
         404: function(response) {
           lackOfThisCity();
           hidingCurrentWeather();
           hidingForecastWeather();
         }
      },

      success: function(data){
        SelectedKindOfWeather();
        SelectedCity();
        thisCityExist();
        hidingForecastWeather();
        showingCurrentWeather();

        $("#yourCity").html("Current's weather in " + capitalizeFirstLetter(city));
        $("#cloud").html("cloudiness: " + data.weather[0].description);
        $("#temperature").html("temperature: " + roundNumber(calvinToCelsius(data.main.temp)) +'&#x2103;');
        $("#humidity").html("humidity: " + data.main.humidity + "%");
        $("#wind").html("wind speed: " + data.wind.speed + "km/h");

      }
    });
    clearInput();
};

function getWeatherForecast(city) {
    let weatherAPI= "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid=7ea00d73a83a2dc576cf68ab20a5f063"

    $.ajax({
      type: 'get',
      url: weatherAPI,

      statusCode: {
         404: function(response) {
           lackOfThisCity();
           hidingCurrentWeather();
           hidingForecastWeather();
         }
      },

      success: function(data){

        SelectedKindOfWeather();
        SelectedCity();
        thisCityExist();
        hidingCurrentWeather();
        showingForecastWeather();
        getMaxValue(data)
        getMinValue(data)
        chartForWeather(data);
        chartForWeatherSecond(data);

      }
    });
    clearInput();
};


$(document).ready(function() {
  $('#inputCity').focus();
  $("#formWeather").submit(function(event){
    event.preventDefault();
    let city = $("#inputCity").val();

    if (city === "") {

      notSelectedCity();
      hidingCurrentWeather();
      hidingForecastWeather();
      thisCityExist();
      SelectedKindOfWeather();

    }
    else {
      SelectedCity()
      let card = document.getElementById("inputState");
      if(card.selectedIndex == 0) {
         notSelectedKindOfWeather();
         hidingCurrentWeather();
         hidingForecastWeather();
         thisCityExist();
         SelectedCity();
      }
      else if (card.selectedIndex == 1) {
         SelectedCity();
         SelectedKindOfWeather();
         getWeatherCurrent(city);

      }
      else {
         getWeatherForecast(city);
      }
    };
  });
});



function chartForWeather(dataToChart){
    $(document).ready(function() {
      let myChart = document.getElementById('myChart').getContext('2d');

      Chart.defaults.globalFontFamily= 'Ariel';
      Chart.defaults.globalFontSize= 15;
      Chart.defaults.globalFontColor= '#fff';


      let weatherChart = new Chart (myChart, {
        type:'line',
        data: {
          labels:removingCharactersFromString(dataToChart),
          datasets:[{
            fill: false,
            lineTension: 0.1,
            borderColor: "rgb(165, 176, 52)",
            pointBorderColor: "rgb(3, 41, 3)",
            pointBackgroundColor: "rgba(3, 41, 3, 0.8)",
            pointRadius: 2,
            label:'temperature',
            data: temperaturesArrayinCelsiusRounded(dataToChart)
          }]
        },
        options: {
          scales: {
            yAxes: [{
               scaleLabel: {
                    display: true,
                    labelString: 'temperature[°C]',
                    fontColor: "rgb(165, 176, 52)",
                  },
                ticks: {
                    max: getMaxValue(dataToChart),
                    min: getMinValue(dataToChart),
                }
             }]
          },
          title: {
            display: true,
            text: 'Temperature for five days',
            fontSize: 25
          },
          legend: {
            position: 'top'
          }
        }
      });
    });
}


function chartForWeatherSecond(dataToChart){
    $(document).ready(function() {
      let myChart = document.getElementById('myChart').getContext('2d');

      Chart.defaults.globalFontFamily= 'Ariel';
      Chart.defaults.globalFontSize= 15;
      Chart.defaults.globalFontColor= '#fff';

      let weatherChart = new Chart (myChartSecond, {
        type:'line',
        data: {
          labels:removingCharactersFromString(dataToChart),
          datasets:[{
            fill: false,
            lineTension: 0.1,
            borderColor: "rgb(240, 44, 71)",
            pointBorderColor: "rgb(91, 37, 25)",
            pointBackgroundColor: "rgba(91, 37, 25, 0.8)",
            pointRadius: 2,
            label:'pressure',
            data: pressureArray(dataToChart),
            yAxisID: 'y-axis-1'},{
              fill: false,
              lineTension: 0.1,
              borderColor: "rgb(118, 186, 208)",
              pointBorderColor: "rgb(2, 8, 56)",
              pointBackgroundColor: "rgba(2, 8, 56, 0.8)",
              pointRadius: 2,
              label:'wind speed',
              data: speedWindArray(dataToChart),
              yAxisID: 'y-axis-2'}
            ],
        },
        options: {
          scales: {
            yAxes: [{
              scaleLabel: {
                   display: true,
                   labelString: 'air pressure[hPa]',
                   fontColor: "rgb(240, 44, 71)",
                 },
                 ticks: {
                      fontColor: "rgb(240, 44, 71)",
                      fontSize: 10
                 },
              type: 'linear',
              display: true,
              position: 'left',
              id: 'y-axis-1',
                  },
                  {
                  scaleLabel: {
                       display: true,
                       labelString: 'wind speed[km/h]',
                       fontColor: "rgb(118, 186, 208)",
                     },
                     ticks: {
                          fontColor: "rgb(118, 186, 208)",
                     },
  							type: 'linear',
  							display: true,
  							position: 'right',
  							id: 'y-axis-2',
  							gridLines: {
  								drawOnChartArea: false,
							}

             }]
          },
          title: {
            display: true,
            text: 'Air pressure and wind speed for five days',
            fontSize: 25
          },
          legend: {
            position: 'top'
          }
        }
      });
    });
}
