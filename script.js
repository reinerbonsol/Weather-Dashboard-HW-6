var city = $('#searchTerm').val();

const apiKey = '&appid=20f205dc929d8b0b3b1e8217d446ae6a';

var date = new Date();

var savedLocations = [];

var currentLoc;

$('#searchTerm').keypress(function (event) {

    if (event.keyCode === 13) {
        event.preventDefault();
        $('#searchBtn').click();
    }
});

$('#searchBtn').on('click', function () {

    $('#forecastH5').addClass('show');

    city = $('#searchTerm').val();

    $('#searchTerm').val('');

    var queryUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + apiKey;

    $.ajax({
        url: queryUrl,
        method: 'GET'
    })
        .then(function (response) {

            console.log(response)

            console.log(response.name)
            console.log(response.weather[0].icon)

            var tempF = (response.main.temp - 273.15) * 1.80 + 32;
            console.log(Math.floor(tempF))

            console.log(response.main.humidity)

            console.log(response.wind.speed)

            getCurrentConditions(response);
            getCurrentForecast(response);
            makeList();
        })
});

// $('#searchBtn').on('click', function() {
//     city = $('#searchTerm').val();
//     getCurrentConditions(city);
//     getCurrentForecast(city);
//     JSON.parse(localStorage.getItem("search")).push(city);
//     localStorage.setItem('search', JSON.stringify(JSON.parse(localStorage.getItem("search"))));
//     renderSearchHistory();
// })

function makeList() {
    var listItem = $('<li>').addClass('list-group-item').text(city);
    $('.list').append(listItem);
}

function getCurrentConditions(response) {

    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    tempF = Math.floor(tempF);

    $('#currentCity').empty();

    var card = $('<div>').addClass('card');
    var cardBody = $('<div>').addClass('card-body');
    var city = $('<h4>').addClass('card-title').text(response.name);
    var cityDate = $('<h4>').addClass('card-title').text(date.toLocaleDateString('en-US'));
    var temperature = $('<p>').addClass('card-text current-temp').text('Temperature: ' + tempF + ' °F');
    var humidity = $('<p>').addClass('card-text current-humidity').text('Humidity: ' + response.main.humidity + '%');
    var wind = $('<p>').addClass('card-text current-wind').text('Wind Speed: ' + response.wind.speed + ' MPH');
    var image = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + response.weather[0].icon + '.png');

    var uvURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=20f205dc929d8b0b3b1e8217d446ae6a&lat=' + response.coord.lat + '&lon=' + response.coord.lat;
    $.ajax({
        url: uvURL,
        method: 'GET'
    }).then(function (uvResponse) {
        var uvIndex = uvResponse.value;
        console.log(uvResponse)

        var bgColor;

        if (uvIndex <= 3) {
            bgColor = 'green';
        } else if (uvIndex >= 4 || uvIndex <= 8) {
            bgColor = 'yellow';
        } else if (uvIndex >= 9) {
            bgColor = 'red';
        }

        var uvDisp = $('<p>').attr('class', 'card-text').text('UV Index: ');
        uvDisp.append($('<span>').attr('class', 'uvIndex').attr('style', ('background-color:' + bgColor)).text(uvIndex));

        city.append(cityDate, image)
        cardBody.append(city, temperature, humidity, wind, uvDisp);
        card.append(cardBody);
        $('#currentCity').append(card)
    });
}

function getCurrentForecast() {

    $.ajax({
        url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + apiKey,
        method: 'GET'
    }).then(function (response) {

        console.log(response)
        console.log(response.dt)
        $('#forecast').empty();

        var results = response.list;
        console.log(results)


        for (var i = 0; i < results.length; i++) {

            var day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
            var hour = results[i].dt_txt.split('-')[2].split(' ')[1];
            console.log(day);
            console.log(hour);

            // if (results[i] !== -1 || results[i] <= 4) {
            if (results[i].dt_txt.indexOf('12:00:00') !== -1) {

                var temp = (results[i].main.temp - 273.15) * 1.80 + 32;
                var tempF = Math.floor(temp);

                var card = $('<div>').addClass('card col-md-2 ml-4 bg-primary text-white');
                var cardBody = $('<div>').addClass('card-body p-3 forecastBody')
                // var cityDate = $('<h4>').addClass('card-title').text(moment(results[i].dt_txt, "X").format("MMM Do"));
                var cityDate = $('<h4>').addClass('card-title').text(new Date(results[i].dt_txt).toLocaleDateString());
                var temperature = $('<p>').addClass('card-text forecastTemp').text('Temperature: ' + tempF + ' °F');
                var humidity = $('<p>').addClass('card-text forecastHumidity').text('Humidity: ' + results[i].main.humidity + '%');

                var image = $('<img>').attr('src', 'https://openweathermap.org/img/w/' + results[i].weather[0].icon + '.png')

                cardBody.append(cityDate, image, temperature, humidity);
                card.append(cardBody);
                $('#forecast').append(card);

            }
        }
    });

}