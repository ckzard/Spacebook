$(".current-box").hide();
$(".forecast-banner").hide();
var forecastdisplay;

// Displays previous city searches from the user's local storage 
function allStorage() {
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;
    while (i--) {
        values.push(localStorage.getItem(keys[i]));
    }
    for (j = 0; j < values.length; j++) {
        $(".prev-list").prepend("<button class='prev-city mt-1'>" + values[j] + "</button>");
    }
}
allStorage();

// Clears local storage data from page
$(".clear").on("click", function () {
    localStorage.clear();
    $(".prev-city").remove();
});

//This function initiates the process of collecting the data from "The Weather APIs" to display on the page 
$(".search").on("click", function () {
    var subject = $(".subject").val();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + subject + "&appid=88d9e018c72362777892f1fbbbb2dfb3";
    var queryURL2 = "https://api.openweathermap.org/data/2.5/forecast?q=" + subject + "&appid=88d9e018c72362777892f1fbbbb2dfb3";
    var lat;
    var lon;
    if (forecastdisplay === true) {
        $(".forecast-day").remove();
        forecastdisplay = false;
    }

    //This first ajax request collects current weather data and converts info into what is needed to be displayed
    $.ajax({
        url: queryURL,
        method: "GET",
        statusCode: {
            404: function () {
                return;
            }
        }
    }).then(function (response) {
        console.log(response);
        $(".prev-list").prepend("<button class='prev-city mt-1'>" + subject + "</button>");
        localStorage.setItem(subject, subject);
        $(".current-box").show();
        $(".forecast-banner").show();
        var iconcode = response.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        $(".icon").attr('src', iconurl)
        lat = response.coord.lat;
        lon = response.coord.lon;
        $(".current-city").text(response.name + " " + moment().format('ll'));
        var currentTemp = response.main.temp - 273.15;
        $(".current-temp").text("Temperature: " + currentTemp.toFixed(1) + " °C");
        $(".current-hum").text("Humidity: " + response.main.humidity + "%");
        $(".current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
        queryURL = "http://api.openweathermap.org/data/2.5/uvi/forecast?&appid=88d9e018c72362777892f1fbbbb2dfb3&lat=" + lat + "&lon=" + lon;
        //This is nested ajax request that gets the UV index but uses longitude and latitude from the previous ajax request 
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            $(".current-uv").text("UV Index: " + response[0].value);
        })
    })

});

//This click fuction will search the weather stats for the previous city when "city button" is clicked on.
$(document).on("click", ".prev-city", function () {
    var subject = $(this).text();
    $(".subject").val(subject);
    $(".search").click();
    $(this).remove();
});


