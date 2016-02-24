var boshService = "http://sox.ht.sfc.keio.ac.jp:5280/http-bind/";
var xmppServer = "sox.ht.sfc.keio.ac.jp";
var client;

var fujisawaAvgTemp = 16;
var fujisawaAvgHum = 61.9
var santanderAvgTemp = 13.9;
var santanderAvgHum = 73;
var genovaAvgTemp = 19;
var genovaAvgHum = 68;
var mitakaAvgTemp = 16;
var mitakaAvgHum = 61.9


window.onload = function() {

    // SoxServerへ接続
    client = new SoxClient(boshService, xmppServer);
    var soxEventListener = new SoxEventListener();

    soxEventListener.connected = function(soxEvent) {
        status("Connected: "+soxEvent.soxClient);

        var deviceNames = [
            "気象警報・注意報藤沢市",
            "そらまめ君藤沢市役所",
            "湘南・江ノ島の海の天気",
            "湘南・江ノ島今日の降水確率2",

            "気象警報・注意報三鷹市",
            "そらまめ君武蔵野市関前",
            "三鷹市のピンポイント天気",
            "三鷹市今日の降水確率2",

			'そらまめ君連雀通り下連雀',
			'そらまめ君藤沢市役所',
			'SantanderWeatherSensorDemo',
			'GenovaWeatherSensorDemo',
            'TodayTotalSmileFujisawa',
            'TodayTotalSmileMitaka',
            'TodayTotalSmileGenova',
            'TodayTotalSmileSantander',
            'GenovaWeatherDemo',
            'SantanderWeatherDemo'
        ];

        deviceNames.forEach(function(name){
            var device = new Device(name);//デバイス名に_dataや_metaはつけない
            /* クライアントに繋がったら、デバイスにサブスクライブする */
            if(!client.subscribeDevice(device)){
                /* サーバに繋がってない場合などで、要求を送信できなかった場合はfalseが返ってくる */
                status("Couldn't send subscription request: "+device);
            }
        });
    };

    soxEventListener.resolved = function(soxEvent) {
        status("Device Resolved: " + soxEvent.soxClient);
    };
    soxEventListener.connectionFailed = function(soxEvent) {
        status("Connection Failed: "+soxEvent.soxClient);
    };
    soxEventListener.subscribed = function(soxEvent){
        status("Subscribed: "+soxEvent.device);
    };
    soxEventListener.subscriptionFailed = function(soxEvent){
        /* デバイスが存在しないなどのときはここに来る */
        status("Subscription Failed: "+soxEvent.device);
    };
    soxEventListener.metaDataReceived = function(soxEvent){
        /**
         * SoXサーバからデバイスのメタ情報を受信すると呼ばれる。
         * 受信したメタ情報に基づいて、Device内にTransducerインスタンスが生成されている。
         */
        status("Meta data received: "+soxEvent.device);
    };
    soxEventListener.sensorDataReceived = function(soxEvent){
        /**
         * SoXサーバからセンサデータを受信すると呼ばれる。
         * 受信したデータはTransducerインスタンスにセットされ、そのTransducerがイベントオブジェクトとして渡される。
         */
        status("Sensor data received: "+soxEvent.device);

        var device = soxEvent.device;
        var levelNum = 2;

        if (device.name == 'TodayTotalSmileFujisawa'){
            // Set Fujisawa Smile Value
			var fujisawaSmile = device.transducers[levelNum].sensorData.rawValue
            setFujisawaSmile(fujisawaSmile);
        }
        if (device.name == 'TodayTotalSmileGenova'){
            // Set Genova Smile Value
			var genovaSmile = device.transducers[levelNum].sensorData.rawValue
            setGenovaSmile(genovaSmile);
        }
        if (device.name == 'TodayTotalSmileSantander'){
            // Set Santander Smile Value
			var santanderSmile = device.transducers[levelNum].sensorData.rawValue
            setSantanderSmile(santanderSmile);
        }
        if (device.name == 'TodayTotalSmileMitaka'){
            // Set Mitaka Smile Value
			var mitakaSmile = device.transducers[levelNum].sensorData.rawValue
            setMitakaSmile(mitakaSmile);
        }
		if (device.name == 'そらまめ君連雀通り下連雀'){
            // Set Mitaka Air Value
            targetID = "mitaka-air";
			var no2 = device.transducers[6].sensorData.rawValue;
			var temperature = device.transducers[18].sensorData.rawValue;
			var humidity = device.transducers[19].sensorData.rawValue;
            var windspeed = device.transducers[17].sensorData.rawValue;
            var rainfall = 0;
            setMitakaAir(no2);
            setMitakaLiving(getLivingIndex(temperature, humidity));
            setMitakaWashing(getWashingIndex(temperature, humidity, rainfall, windspeed, mitakaAvgTemp, mitakaAvgHum));
		}
		if (device.name == 'そらまめ君藤沢市役所'){
            // Set Fujisawa Air Value
            targetID = "fujisawa-air";
			var no2 = device.transducers[6].sensorData.rawValue;
			var temperature = device.transducers[18].sensorData.rawValue;
			var humidity = device.transducers[19].sensorData.rawValue;
            var windspeed = device.transducers[17].sensorData.rawValue;
            var rainfall = 0;
            setFujisawaAir(no2);
            setFujisawaLiving(getLivingIndex(temperature, humidity));
            setFujisawaWashing(getWashingIndex(temperature, humidity, rainfall, windspeed, fujisawaAvgTemp, fujisawaAvgHum));
		}
		if (device.name == 'SantanderWeatherSensorDemo'){
            // Set Santander Air Value
            targetID = "santander-air";
			var no2 = device.transducers[8].sensorData.rawValue;
			var temperature = device.transducers[2].sensorData.rawValue;
			var humidity = device.transducers[5].sensorData.rawValue;
            if (isNaN(Number(no2))){
				no2 = 0;
			}
            setSantanderAir(no2);
            setSantanderLiving(getLivingIndex(temperature, humidity));
		}
		if (device.name == 'GenovaWeatherSensorDemo'){
            // Set Genova Air Value
            targetID = "genova-air";
			var no2 = device.transducers[8].sensorData.rawValue;
			var temperature = device.transducers[2].sensorData.rawValue;
			var humidity = device.transducers[5].sensorData.rawValue;
			if (isNaN(Number(no2))){
				no2 = 0;
			}
            setGenovaAir(no2);
            setGenovaLiving(getLivingIndex(temperature, humidity));
		}
		
        if (device.name == 'SantanderWeatherDemo'){
            var temperature = device.transducers[4].sensorData.rawValue;
            var windspeed = device.transducers[5].sensorData.rawValue;
            var humidity = device.transducers[6].sensorData.rawValue;
            //var rainfall = device.transducers[7].sensorData.rawValue;
            var rainfall = 0;
            setSantanderWashing(getWashingIndex(temperature, humidity, rainfall, windspeed, santanderAvgTemp, santanderAvgHum));
        }

        if (device.name == 'GenovaWeatherDemo'){
            var temperature = device.transducers[4].sensorData.rawValue;
            var windspeed = device.transducers[5].sensorData.rawValue;
            var humidity = device.transducers[6].sensorData.rawValue;
            //var rainfall = device.transducers[7].sensorData.rawValue;
            var rainfall = 0;
            setGenovaWashing(getWashingIndex(temperature, humidity, rainfall, windspeed, genovaAvgTemp, santanderAvgHum));
        }
    };

    client.setSoxEventListener(soxEventListener);
    client.connect();
};

function status(message){
    console.log('[soxreceiver.js]' + message);
}

function calcAirCondition(air, smile){
	return Math.floor(air);
}

