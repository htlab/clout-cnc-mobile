function onBackButtonClicked(city){
    if (city == "santander"){
        location.replace("http://sox.ht.sfc.keio.ac.jp/~richie/mobile/santander/")
    } else if(city == "genova"){
        location.replace("http://sox.ht.sfc.keio.ac.jp/~richie/mobile/genova/")
    }
}

function setMitakaAir(message){
    $("#air_mitaka").html(createAirMessage(message));
}

function setMitakaLiving(message){
    $("#living_mitaka").html(createLivingMessage(message));
}

function setMitakaWashing(message){
    $("#washing_mitaka").html(createWashingMessage(message));
}

function setMitakaSmile(smile){
    var message = createSmileMessage(smile);
    $("#smile_mitaka").html(message);
}

function setGenovaAir(message){
    $("#air_genova").html(createAirMessage(message));
}

function setGenovaLiving(message){
    $("#living_genova").html(createLivingMessage(message));
}

function setGenovaWashing(message){
    $("#washing_genova").html(createWashingMessage(message));
}

function setGenovaSmile(smile){
    var message = createSmileMessage(smile);
    $("#smile_genova").html(message);
}

function setSantanderAir(message){
    $("#air_santander").html(createAirMessage(message));
}

function setSantanderLiving(message){
    $("#living_santander").html(createLivingMessage(message));
}

function setSantanderWashing(message){
    $("#washing_santander").html(createWashingMessage(message));
}

function setSantanderSmile(smile){
    var message = createSmileMessage(smile);
    $("#smile_santander").html(message);
}

function setFujisawaAir(message){
    $("#air_fujisawa").html(createAirMessage(message));
}

function setFujisawaLiving(message){
    $("#living_fujisawa").html(createLivingMessage(message));
}

function setFujisawaWashing(message){
    $("#washing_fujisawa").html(createWashingMessage(message));
}

function setFujisawaSmile(smile){
    var message = createSmileMessage(smile);
    $("#smile_fujisawa").html(message);
}

function createSmileMessage(smile){
    var message = "<h3>Today's Good";
    message += '<img src="./img/smile.png" class="smile">';
    message += 'x ' + smile + '</h3>';
    return message;
}

function createAirMessage(air){
    var message = "<h3>Environmental Index: ";
    air = getEnvironmentalIndex(air); 
    message +=  air + '</h3>';
    return message;
}

function createWashingMessage(param){
    var message = "<h3>Washing Index: ";
    message +=  param + '</h3>';
    return message;
}

function createLivingMessage(param){
    var message = "<h3>Living Index: ";
    message +=  param + '</h3>';
    return message;
}
