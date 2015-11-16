(function(){
  var API_WORLDTIME_KEY = "4765ef862914cabb02edacd6ab28b";
  var API_WORLDTIME_URL ="http://api.worldweatheronline.com/free/v2/tz.ashx?key=" + API_WORLDTIME_KEY + "&format=json" + "&q=";
  var API_WEATHER_KEY = "ec972b272d19ce968bc300214c40c7ee";
  var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&";
  var API_WEATHER_IMAGE = "http://openweathermap.org/img/w/"

  var cityAddInput = $("[data-input='cityAdd']");
  var cityAddBtn = $("[data-button='add']");
  var citySaved = $("[data-saved-cities]");
  var cities = [];
  var cityWeather = {
    zone: "",
    icon: "",
    temp: 0,
    temp_max: 0,
    temp_min: 0,
    main: ""
  };


  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(getCoords, errorFound, posExact);
  } else {
    alert("Actualiza tu navegador muchach@!");
  }

  function errorFound(error){
    alert("A ocurrido el error: " + error.code);
  }

  function posExact(){
    enableHighAccuracy: true;
  }

  function getCoords(position){
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    // alert ("Tu posición actual es: " + lat + "," + lon);
    $.getJSON(API_WEATHER_URL + "lat=" + lat + "&lon=" + lon, getCurrentWeather)
  }



  function getCurrentWeather(data){
    cityWeather.zone = data.name;
    cityWeather.icon = API_WEATHER_IMAGE + data.weather[0].icon + ".png";
    cityWeather.temp = data.main.temp - 273.15;
    cityWeather.temp_max = data.main.temp_max - 273.15;
    cityWeather.temp_min = data.main.temp_min - 273.15;
    cityWeather.main = data.weather[0].main;

    renderTemplate(cityWeather);
  }

  function activateTemplate(id){
    var t = document.querySelector(id);
    return document.importNode(t.content, true);
  }

  function renderTemplate(cityWeather, localtime){

    var date = new Date();
    var timeNow = date.toLocaleTimeString();
    var tiempecito = localtime;

    if(localtime){
    }else {
      tiempecito = timeNow;
    }

    var clone = activateTemplate("#template--city");
    clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
    clone.querySelector("[data-icon]").src = cityWeather.icon;
    clone.querySelector("[data-time]").innerHTML = tiempecito;
    clone.querySelector("[data-temp='max']").innerHTML = cityWeather.temp_max.toFixed(1);
    clone.querySelector("[data-temp='min']").innerHTML = cityWeather.temp_min.toFixed(1);
    clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(1);

    $(".loader").hide();
    $("body").append(clone);

  }

  cityAddBtn.click(addNewCity);
  cityAddInput.on("keypress", function(event){
    if (event.which == 13) {
      addNewCity(event);
    }
  })

  citySaved.click(loadSavedCities);

  function addNewCity(event){
    event.preventDefault();
    $.getJSON(API_WEATHER_URL + "q=" + cityAddInput.val(), getWeatherCity);
  }

  function getWeatherCity(data){
    $.getJSON(API_WORLDTIME_URL + cityAddInput.val(), function(respuesta){

      cityAddInput.val("");
      cityWeather = {};
      cityWeather.zone = data.name;
      cityWeather.icon = API_WEATHER_IMAGE + data.weather[0].icon + ".png";
      cityWeather.temp = data.main.temp - 273.15;
      cityWeather.temp_max = data.main.temp_max - 273.15;
      cityWeather.temp_min = data.main.temp_min - 273.15;
      cityWeather.main = data.weather[0].main;

      renderTemplate(cityWeather, respuesta.data.time_zone[0].localtime.split(" ")[1]);

      cities.push(cityWeather);
      localStorage.setItem("ciudades", JSON.stringify(cities));
    })
  }

  function loadSavedCities(event){
    event.preventDefault();
    var ciudadelas = JSON.parse(localStorage.getItem("ciudades"));
    ciudadelas.forEach(function(a){
      renderTemplate(a);
    })
  }

})();
