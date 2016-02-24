var boshService = "http://sox.ht.sfc.keio.ac.jp:5280/http-bind/";
var xmppServer = "sox.ht.sfc.keio.ac.jp";
var client;

var mitakaAir = 0;
var mitakaSmile = 0;
var genovaAir = 0;
var genovaSmile = 0;
var santanderAir = 0;
var santanderSmile = 0;
var fujisawaAir = 0;
var fujisawaSmile = 0;

window.onload = function() {

    // SoxServerへ接続
    client = new SoxClient(boshService, xmppServer);
    var soxEventListener = new SoxEventListener();

    soxEventListener.connected = function(soxEvent) {
        status("Connected: "+soxEvent.soxClient);

        var deviceNames = [
			'そらまめ君連雀通り下連雀',
			'そらまめ君藤沢市役所',
			'SantanderWeatherSensorDemo',
			'GenovaWeatherSensorDemo',
            'TodayTotalSmileFujisawa',
            'TodayTotalSmileMitaka',
            'TodayTotalSmileGenova',
            'TodayTotalSmileSantander'
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
			fujisawaSmile = device.transducers[levelNum].sensorData.rawValue
            setFujisawaSmile(fujisawaSmile);
            setFujisawaAir(calcAirCondition(fujisawaAir, fujisawaSmile));
        }
        if (device.name == 'TodayTotalSmileGenova'){
            // Set Genova Smile Value
			genovaSmile = device.transducers[levelNum].sensorData.rawValue
            setGenovaSmile(genovaSmile);
            setGenovaAir(calcAirCondition(genovaAir, genovaSmile));
        }
        if (device.name == 'TodayTotalSmileSantander'){
            // Set Santander Smile Value
			santanderSmile = device.transducers[levelNum].sensorData.rawValue
            setSantanderSmile(santanderSmile);
            setSantanderAir(calcAirCondition(santanderAir, santanderSmile));
        }
        if (device.name == 'TodayTotalSmileMitaka'){
            // Set Mitaka Smile Value
			mitakaSmile = device.transducers[levelNum].sensorData.rawValue
            setMitakaSmile(mitakaSmile);
            setMitakaAir(calcAirCondition(mitakaAir, mitakaSmile));
        }
		if (device.name == 'そらまめ君連雀通り下連雀'){
            // Set Mitaka Air Value
            targetID = "mitaka-air";
			var value = device.transducers[6].sensorData.rawValue;
			mitakaAir = value;
            setMitakaAir(calcAirCondition(mitakaAir, mitakaSmile));
		}
		if (device.name == 'そらまめ君藤沢市役所'){
            // Set Fujisawa Air Value
            targetID = "fujisawa-air";
			var value = device.transducers[6].sensorData.rawValue;
			fujisawaAir = value;
            setFujisawaAir(calcAirCondition(fujisawaAir, fujisawaSmile));
		}
		if (device.name == 'SantanderWeatherSensorDemo'){
            // Set Santander Air Value
            targetID = "santander-air";
			var value = device.transducers[8].sensorData.rawValue;
			santanderAir = value;
            setSantanderAir(calcAirCondition(santanderAir, santanderSmile));
		}
		if (device.name == 'GenovaWeatherSensorDemo'){
            // Set Genova Air Value
            targetID = "genova-air";
			var value = device.transducers[8].sensorData.rawValue;
			if (isNaN(Number(value))){
				value = 0;
			}
			genovaAir = value;
            setGenovaAir(calcAirCondition(genovaAir, genovaSmile));
		}

    };

    client.setSoxEventListener(soxEventListener);
    client.connect();
};

function status(message){
    console.log('[soxreceiver.js]' + message);
}

function calcAirCondition(air, smile){
	return Math.floor(smile * 2 - air);
}
