var boshService = "http://sox.ht.sfc.keio.ac.jp:5280/http-bind/";
var xmppServer = "sox.ht.sfc.keio.ac.jp";
var client;

var TARGET_CITY = "Santander";
var ENV = TARGET_CITY + "WeatherDemo";
var ENV2 = TARGET_CITY + "WeatherSensorDemo";
var SMILE = 'TodayTotalSmile' + TARGET_CITY;

var temperature = 0;
var windspeed = 0;
var humidity = 0;
var rainfall = 0;

window.onload = function() {

    initialize();

    // SoxServerへ接続
    client = new SoxClient(boshService, xmppServer);
    var soxEventListener = new SoxEventListener();

    soxEventListener.connected = function(soxEvent) {
        status("Connected: "+soxEvent.soxClient);


        var deviceNames = [ENV, ENV2, SMILE];
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

        if (soxEvent.device.name == "SmileDetector") {
            var transducer_latitude = soxEvent.device.getTransducer("latitude");
            var transducer_longitude = soxEvent.device.getTransducer("longitude");
            var transducer_city = soxEvent.device.getTransducer("city");
            var transducer_level = soxEvent.device.getTransducer("level");

            var data_latitude = new SensorData("latitude", new Date(), 0, 0);
            var data_longitude = new SensorData("longitude", new Date(), 0, 0);
            var data_city = new SensorData("city", new Date(), CITY, CITY);
            var data_level = new SensorData("level", new Date(), 1, 1);
            

            transducer_latitude.setSensorData(data_latitude);
            transducer_longitude.setSensorData(data_longitude);
            transducer_city.setSensorData(data_city);
            transducer_level.setSensorData(data_level);

            soxEvent.soxClient.publishDevice(soxEvent.device);
        }
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

        if (device.name == ENV){
            status("Env info received");
            temperature = device.transducers[4].sensorData.rawValue;
            windspeed = device.transducers[5].sensorData.rawValue;
            humidity = device.transducers[6].sensorData.rawValue;
            rainfall = device.transducers[7].sensorData.rawValue;
            setSoxParams(temperature, windspeed, humidity, rainfall);
        }

        if (device.name == ENV2){
            no2 = device.transducers[8].sensorData.rawValue;
            setEnvironmentalIndex(no2);
        }

        if (device.name == SMILE){
            var smile = device.transducers[2].sensorData.rawValue;
            setSmileCount(smile);
        }
    };

    soxEventListener.published = function(soxEvent){
        goResultPage();
    }
    
    client.setSoxEventListener(soxEventListener);
    client.connect();
};

function publishSmileLevel() {
    var device = new Device("SmileDetector", client);
}

function status(message){
    console.log('[soxreceiver.js]' + message);
}
