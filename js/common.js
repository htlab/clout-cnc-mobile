var livingImage = './img/living.png';
var livingSummary = 'Living index means how people can live comfortably. 70 is most comfortable.';

//var drivingImage = './img/drive.png';
//var drivingSummary = 'Driving index means recoomendation value of driving a car. The higher, the more suitable.';

var washingImage = './img/washing.png';
var washingSummary = 'Washing index means recoomendation value of washing a cloth. The higher, more suitable.';

var dryImage = './img/dry.png';
var drySummary = 'Dry index means how dryness of the air. Show dryness according to the humidity sensor.';

var rainingImage = './img/raining.png';
var rainingSummary = 'Raining rate shows current raining rate. This is real time information from the sensor.';

var smileImage = './img/smile.png';
var smileSummary = 'Raining rate shows current raining rate. This is real time information from the sensor.';

var environmentalImage = './img/dry.png';
var environmentalSummary = 'Environmental Index means the cleanness of the environmental. This is calculated by real time information from the sensor.';
function onGoodButtonClicked(){
    $('#box_thanks').fadeIn('slow',function(){
        $("#box_thanks").get(0).scrollIntoView(true)
        setTimeout(function(){
            publishSmileLevel();
        }, 1000);
    });
}

function initialize(){
    setLivingSummary(livingSummary);
    setLivingImage(livingImage);
//    setDrivingSummary(drivingSummary);
//    setDrivingImage(drivingImage);
    setWashingSummary(washingSummary);
    setWashingImage(washingImage);
    setSmileSummary(smileSummary);
    setSmileImage(smileImage);
    setEnvironmentalSummary(environmentalSummary);
    setEnvironmentalImage(environmentalImage);
}

function setSoxParams(temperature, windspeed, humidity, rainfall, no2){
    //setDryIndex(humidity);
    //setRainingRate(rainfall);
    //setEnvironmentalIndex(no2);
    setLivingIndex(temperature, humidity);
    setWashingIndex(temperature, humidity, rainfall, windspeed);
}

function calcLivingIndex(temperature, humidity){
    var base = 70;
    var discomfort_index = 0.81 * Number(temperature) + 0.01 * Number(humidity) * (0.99 * Number(temperature) - 14.3) + 46.3;
    var life_index = Math.ceil(100 - 3 * Math.abs(base - discomfort_index));
    var message;

    if (discomfort_index <= 55){
        message = '<h3 class="moderate">Living Index: ' + life_index + '</h3>';
        message += 'It is too cold today...';
    } else if (discomfort_index > 55 && discomfort_index <= 60){
        message = '<h3 class="moderate">Living Index: ' + life_index + '</h3>';
        message += 'It is a bit cold today..';
    } else if (discomfort_index > 60 && discomfort_index <= 65){
        message = '<h3 class="normal">Living Index: ' + life_index + '</h3>';
        message += 'It is a normal day.';
    } else if (discomfort_index > 65 && discomfort_index <= 70){
        message = '<h3 class="normal">Living Index: ' + life_index + '</h3>';
        message += 'It is a nice day!';
    } else if (discomfort_index > 70 && discomfort_index <= 75){
        message = '<h3 class="warning">Living Index: ' + life_index + '</h3>';
        message += 'You would feel a bit hot today.';
    } else if (discomfort_index > 75 && discomfort_index <= 80){
        message = '<h3 class="warning">Living Index: ' + life_index + '</h3>';
        message += 'It is a  bit hot today..';
    } else if (discomfort_index > 80 && discomfort_index <= 85){
        message = '<h3 class="important">Living Index: ' + life_index + '</h3>';
        message += 'It is HOT today.';
    } else if (discomfort_index > 85){
        message = '<h3 class="important">Living Index: ' + life_index + '</h3>';
        message += 'It is too much hot today....';
    }
    return message;
}

function getLivingIndex(temperature, humidity){
    var base = 70;
    var discomfort_index = 0.81 * Number(temperature) + 0.01 * Number(humidity) * (0.99 * Number(temperature) - 14.3) + 46.3;
    var life_index = Math.ceil(100 - 3 * Math.abs(base - discomfort_index));

    return life_index;

}

function setLivingIndex(temperature, humidity){
    setLivingMessage(calcLivingIndex(temperature, humidity));
}

function getWashingIndex(temperature, humidity, rainfall, windspeed, avgTemp, avgHum){
    //var averageTemperature = getAverageTemperature();
    //var averageHumidity = getAverageHumidity();
    var averageTemperature = avgTemp;
    var averageHumidity = avgHum;

    var rainfallParam = 1.5;
    var humidityParam = 1.5;
    var temperatureParam = 0.8;
    var windParam = 1;

    index = 100 - (Number(rainfall) * rainfallParam) - (( Number(humidity) - averageHumidity) * humidityParam) + (( Number(temperature) - averageTemperature) * temperatureParam) + (Number(windspeed) * windParam);

    if (index > 100){
        index = 100;
    } else if (index < 0){
        index = 0;
    }
    
    return index;
}

function calcWashingIndex(temperature, humidity, rainfall, windspeed){
    var averageTemperature = getAverageTemperature();
    var averageHumidity = getAverageHumidity();

    //var rainfallParam = 0;
    var rainfallParam = 1.5;
    var humidityParam = 1.5;
    var temperatureParam = 0.8;
    var windParam = 1;

    index = 100 - (Number(rainfall) * rainfallParam) - (( Number(humidity) - averageHumidity) * humidityParam) + (( Number(temperature) - averageTemperature) * temperatureParam) + (Number(windspeed) * windParam);

    if (index > 100){
        index = 100;
    } else if (index < 0){
        index = 0;
    }

    var message;

    if (index <= 30){
        message = '<h3 class="moderate">Washing Index: ' + index + '</h3>';
        message += 'Let\'s dry clothes in your room';
    } else if (index > 30 && index <= 50){
        message = '<h3 class="normal">Washing Index: ' + index + '</h3>';
        message += 'If it rains, a bit dangerous..';
    } else if (index > 50 && index <= 70){
        message = '<h3 class="normal">Washing Index: ' + index + '</h3>';
        message += 'It\'s a normal day for washing.';
    } else if (index > 70 && index <= 80){
        message = '<h3 class="warning">Washing Index: ' + index + '</h3>';
        message += 'Clothes will get dry.';
    } else if (index > 80){
        message = '<h3 class="warning">Washing Index: ' + index + '</h3>';
        message += 'Today is wonderful day for washing!!';
    }
    
    return message;
}

function setWashingIndex(temperature, humidity, rainfall, windspeed){
    setWashingMessage(calcWashingIndex(temperature, humidity, rainfall, windspeed));
}

function setDryIndex(humidity){
    var value = Number(humidity);
    var message;
    if (value < 40){
        message = '<h3 class="important">Dryness is high. <br> Take care of the fire.</h3>';
    } else if ( value < 70 ){
        message = '<h3 class="normal">Dryness is normal. <br> Let\'s hang out!</h3>';
    } else {
        message = '<h3 class="moderate">Dryness is low. <br> So Humid.</h3>';
    }

    setDryMessage(message);
}

function setRainingRate(rainfall){
    var value = Number(rainfall);
    var message;

    if (value < 20){
        message = '<h1 class="moderate">' + rainfall + '% <h1>';
    } else if (value < 40){
        message = '<h1 class="normal">' + rainfall + '% <h1>';
    } else if (value < 70){
        message = '<h1 class="warning">' + rainfall + '% <h1>';
    } else {
        message = '<h1 class="important">' + rainfall + '% <h1>';
    }
    
    setRainingMessage(message);
}

function calcEnvironmentalIndex(no2){
    if (isNaN(Number(no2))){
        no2 = 0;
    }
    var message = '<h3>Environmental Index</h3>';
    var value = Math.floor(100 - no2*6); 
    if (value > 100){
        value = 100;
    } else if (value < 0){
        value = 0;
    }
    message += '<span class="normal">' + value + '</span>';
    return message;
}

function getEnvironmentalIndex(no2){
    if (isNaN(Number(no2))){
        no2 = 0;
    }
    var value = Math.floor(100 - no2*6); 
    if (value > 100){
        value = 100;
    } else if (value < 0){
        value = 0;
    }
    return value;
}

function setEnvironmentalIndex(no2){
    setEnvironmentalMessage(calcEnvironmentalIndex(no2));
}

function setSmileCount(smile){
    var message = '<h3>Today\'s Total Smile</h3>'
    message += '<span class="warning">' + smile + '</span>';
    setSmileMessage(message);
}

function goResultPage(){
    location.replace("../result.html");
}

function setLivingSummary(summary){
    $("#living_summary").html(summary);
}

function setLivingImage(url){
    $("#living_img").html('<img src=\"' + url + '\">');
}

function setLivingMessage(message){
    $("#living_message").html(message);
}

//function setDrivingSummary(summary){
//    $("#driving_summary").html(summary);
//}
//
//function setDrivingImage(url){
//    $("#driving_img").html('<img src=\"' + url + '\">');
//}
//
//function setDrivingMessage(message){
//    $("#driving_message").html(message);
//}

function setWashingSummary(summary){
    $("#washing_summary").html(summary);
}

function setWashingImage(url){
    $("#washing_img").html('<img src=\"' + url + '\">');
}

function setWashingMessage(message){
    $("#washing_message").html(message);
}

function setDrySummary(summary){
    $("#dry_summary").html(summary);
}

function setDryImage(url){
    $("#dry_img").html('<img src=\"' + url + '\">');
}

function setDryMessage(message){
    $("#dry_message").html(message);
}

function setSmileImage(url){
    $("#smile_img").html('<img src=\"' + url + '\">');
}

function setSmileMessage(message){
    $("#smile_message").html(message);
}

function setSmileSummary(summary){
    $("#smile_summary").html(summary);
}

function setEnvironmentalImage(url){
    $("#environmental_img").html('<img src=\"' + url + '\">');
}

function setEnvironmentalMessage(message){
    $("#environmental_message").html(message);
}

function setEnvironmentalSummary(summary){
    $("#environmental_summary").html(summary);
}

function setRainingSummary(summary){
    $("#raining_summary").html(summary);
}

function setRainingImage(url){
    $("#raining_img").html('<img src=\"' + url + '\">');
}

function setRainingMessage(message){
    $("#raining_message").html(message);
}

function setSmileSummary(summary){
    $("#smile_summary").html(summary);
}

function setSmileImage(url){
    $("#smile_img").html('<img src=\"' + url + '\">');
}

function setSmileMessage(message){
    $("#smile_message").html(message);
}

function setEnvironmentalSummary(summary){
    $("#environmental_summary").html(summary);
}

function setEnvironmentalImage(url){
    $("#environmental_img").html('<img src=\"' + url + '\">');
}

function setEnvironmentalMessage(message){
    $("#environmental_message").html(message);
}
