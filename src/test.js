
    io = require("aws-iot-device-sdk-v2")
    iot = require("aws-iot-device-sdk-v2")
    mqtt = require("aws-iot-device-sdk-v2")

    const USER_ID = "ONEPLUS_PHONE"
    const AWS_HOST = "a335a7dhkg3tvg-ats.iot.us-east-2.amazonaws.com"
    const REGION = "us-east-2"
    const AWS_ACCESS_KEY_ID = 'AKIAREKQMLCTUM7KLS47' 
    const AWS_SECRET_ACCESS_KEY='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'




            
    const client_bootstrap = new io.ClientBootstrap();
    const config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets();

    config_builder.with_clean_session(false);
    config_builder.with_client_id(USER_ID);
    config_builder.with_endpoint(AWS_HOST);
    config_builder.with_credentials(REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, null);

    const config = config_builder.build();
    const client = new mqtt.MqttClient(client_bootstrap);
    
    this.state.awsConnetion = client.new_connection(config)
    this.state.awsConnetion.on('connect', () => {
        console.log("Connected!!!");
        awsConnetion.subscribe('test_topic')
        console.log("Subscribed!!!");
        
    })

    this.state.awsConnetion.on('message', (topic, content) => {
        console.log("message!!!");
       
    })

    this.state.awsConnetion.on('disconnect', () => {
        // TODO reset params ?
        console.log("disconnect!!!");
        awsConnetion.connect().then(
            (res) => {
                console.log(res)
        }).catch(
            (error) => {
                console.log(error)
            }
        )
    })

    this.state.awsConnetion.on('error', (error) => {
        console.log("error!!!");
        
        console.log(error)
        awsConnetion.connect().then(
            (res) => {
                console.log(res)
        }).catch(
            (error) => {
                console.log(error)
            }
        )
    })


    this.state.awsConnetion.on('interrupt', (error) => {
        console.log("interrupt!!!");
        
        console.log(error)
        awsConnetion.connect().then(
            (res) => {
                console.log(res)
        }).catch(
            (error) => {
                console.log(error)
            }
        )
    })

    this.state.awsConnetion.on('resume', (returnCode, is_existing_session) => {
        console.log("resume!!!");
        awsConnetion.connect().then(
            (res) => {
                console.log(res)
        }).catch(
            (error) => {
                console.log(error)
            }
        )
    })

    awsConnetion.connect().then(
        (res) => {
            console.log(res)
    }).catch(
        (error) => {
            console.log(error)
        }
    )
    
