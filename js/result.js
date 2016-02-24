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

function setMitakaSmile(smile){
    var message = createSmileMessage(smile);
    $("#smile_mitaka").html(message);
}

function setGenovaAir(message){
    $("#air_genova").html(createAirMessage(message));
}

function setGenovaSmile(smile){
    var message = createSmileMessage(smile);
    $("#smile_genova").html(message);
}

function setSantanderAir(message){
    $("#air_santander").html(createAirMessage(message));
}

function setSantanderSmile(smile){
    var message = createSmileMessage(smile);
    $("#smile_santander").html(message);
}

function setFujisawaAir(message){
    $("#air_fujisawa").html(createAirMessage(message));
}

function setFujisawaSmile(smile){
    var message = createSmileMessage(smile);
    $("#smile_fujisawa").html(message);
}

function createSmileMessage(smile){
    var message = "<h3>Today's Good";
    message += '<img src="../img/smile.png" class="smile">';
    message += 'x ' + smile + '</h3>';
    return message;
}

function createAirMessage(air){
    var message = "<h3>Air Index: ";
    message +=  air + '</h3>';
    return message;
}
