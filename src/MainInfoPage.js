import React from 'react';
import { Component } from 'react'
import {Card} from 'react-bootstrap'
import PlaceholderImage from './materials/placeholder-images-image_large.png'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import AlarmButton from './AlarmButton'
import VerticalLine from './VerticalLine';
import SelectTimeInterval from './SelectTimeInterval'

import Spinner from "react-activity/dist/Spinner";
import "react-activity/dist/Spinner.css";
import {io, iot, mqtt} from 'aws-iot-device-sdk-v2'
import { Global } from '@emotion/react';

const USER_ID = "ONEPLUS_PHONE"//Bimal: WEB_APP
const AWS_HOST = "a335a7dhkg3tvg-ats.iot.us-east-2.amazonaws.com"//Bimal: a2ledxsgg5rrmb-ats.iot.us-east-2.amazonaws.com
const REGION = "us-east-2" //Bimal: us-east-2
const AWS_ACCESS_KEY_ID = 'AKIAREKQMLCTUM7KLS47' //Bimal: AKIAZDLITMNGFULYJCGE
const AWS_SECRET_ACCESS_KEY='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'//Bimal: zqJU2H7KR4kibVQVnxt31hfKD8zsNHkhauS6PCcq

// Bimal's config
// const USER_ID = "WEB_APP"
// const AWS_HOST = "a2ledxsgg5rrmb-ats.iot.us-east-2.amazonaws.com"
// const REGION = "us-east-2"
// const AWS_ACCESS_KEY_ID = "AKIAZDLITMNGFULYJCGE"
// const AWS_SECRET_ACCESS_KEY="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"



window.connetion = null
  
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export default class MainInfoPage extends Component {
    constructor(props) {

        super(props)
        this.state = {
            awsConnetion:null,
            loading:true, // control the app waiting for connection or not 
            error:null, // once error is set to a value (not null), error will be alerted
            
            // according to UI design
            alarm_status:true,
            monitor_interval:null,
            fileName:null,
            armed_state:false,

        };
        
        this.iotConnect = this.iotConnect.bind(this)
        this.handleArmedStatus = this.handleArmedStatus.bind(this)
        this.iotConnect()
    }


    async iotConnect () {
            
        const client_bootstrap = new io.ClientBootstrap();
        const config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_with_websockets();

        config_builder.with_clean_session(false);
        config_builder.with_client_id(USER_ID);
        config_builder.with_endpoint(AWS_HOST);
        config_builder.with_credentials(REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, null);

        const config = config_builder.build();
        const client = new mqtt.MqttClient(client_bootstrap);
        window.connetion = client.new_connection(config)

        window.connetion.on('connect', async () => {
            await sleep(100)
            console.log("Connected!!!");
            window.connetion.subscribe('ALARM_TIMEOUT', 1)
            window.connetion.subscribe('ALARM_STATUS', 1)
            window.connetion.subscribe('ARMED', 1)
            window.connetion.subscribe('IMAGE_UPLOADED', 1)
            console.log("Subscribed!!!");
            this.setState({loading : false})
        })

        window.connetion.on('message', (topic, content) => {
            console.log("message!!!");
            const message = new TextDecoder().decode(content)
            if (topic === "ARMED") {
                if (message === "\"True\"") {
                    this.setState({armed_state:true})
                } else {
                    this.setState({armed_state:false})
                }
            } else if (topic === "ALARM_STATUS") {
                if (message === "\"True\"") {
                    this.setState({alarm_status:true})
                } else {
                    this.setState({alarm_status:false})
                }
                // download image and update
            }
        })

        window.connetion.on('disconnect', () => {
            console.log("disconnect!!!");
            this.setState({loading : true})
            window.connetion.connect().then(
                (res) => {
                    console.log(res)
            }).catch(
                (error) => {
                    console.log(error)
                }
            )
        })

        window.connetion.on('error', (error) => {
            console.log("error!!!");
            this.setState({error:error})
            console.log(error)
            window.connetion.connect().then(
                (res) => {
                    console.log(res)
            }).catch(
                (error) => {
                    console.log(error)
                }
            )
        })


        window.connetion.on('interrupt', (error) => {
            console.log("interrupt!!!");
            this.setState({error:error})
            console.log(error)
            window.connetion.connect().then(
                (res) => {
                    console.log(res)
            }).catch(
                (error) => {
                    console.log(error)
                }
            )
        })

        window.connetion.on('resume', (returnCode, is_existing_session) => {
            console.log("resume!!!");
            window.connetion.connect().then(
                (res) => {
                    console.log(res)
            }).catch(
                (error) => {
                    console.log(error)
                }
            )
        })
        this.setState({awsConnetion:window.connetion}, 
            function () {
                console.log("here")
                this.state.awsConnetion.connect().then(
                    (res) => {
                        console.log("Connected!!!");
                        this.state.awsConnetion.subscribe('test_topic')
                        console.log("Subscribed!!!");
                        this.setState({loading : false}, ()=>{console.log(this.state.loading)})
                        
                }).catch(
                    (error) => {
                        console.log(error)
                    }
                )
            })
    }



    handleArmedStatus() {
        this.setState(
            {
                armed_state:!this.state.armed_state
            },

            function() {
                // publish this.state.armed_state
                console.log("armed_state " + this.state.armed_state)
                var armed = ''
                if (this.state.armed_state) {
                    armed = "True"
                } else {
                    armed = "False"
                }
                window.connetion.publish("ARMED", armed, 1)
            }
        )
    }

    render() {
        return (
            <div style={{padding:0, overflowX:"hidden", }}>
                <script src="https://sdk.amazonaws.com/js/aws-sdk-2.179.0.min.js"></script>
                {this.state.loading ? 
                    
                    <div style={{width:"100vw", height:"100vh",  textAlign: "center", backgroundColor:"#1a4492", overflow:"hidden"}}>
                        <Spinner style={{display: "inline-block", marginTop:"15%"}} size={30} color="white" animating={this.state.loading}/>
                        <br/>
                        <div style={{color:"white"}}>Connecting...</div>
                    </div> 
                    
                    :
                    <div id="webapp-container" style={{width:"100vw", height:"100%", }}>
                        
                        <div id='info-container' style={{width:"100%", height:"auto", }}>
                            <Card style={{boxShadow: "0px 0px 10px gray", border: "0px solid transparent", borderRadius:20, width:"50%", marginLeft:"25%", marginTop:"5%"}}>
                                <div style={{width:"100%", textAlign:"center",}}>

                                    {this.state.alarm_status ?
                                        // if there is a fire, show fire
                                        <div>
                                        <LocalFireDepartmentIcon sx={{ fontSize: 80, color:"red", display:"inline-block" }}></LocalFireDepartmentIcon>
                                        <br />
                                        <text style={{ fontSize: 30, color:"red"}}>Your oven is on fire!</text>
                                        </div>
                                    :   
                                        // if no fire, show ice
                                        <div>
                                        <AcUnitIcon sx={{ fontSize: 80, color:"#DBF1FD", display:"inline-block", }}></AcUnitIcon>
                                        <br />
                                        <text style={{ fontSize: 30, color:"grey"}}>You are cool.</text>
                                        </div>
                                    }
                                    
                                    {this.state.fileName===null ?

                                        // if no image yet, give placeholder 
                                        <Card.Img src={PlaceholderImage}></Card.Img>
                                    :
                                        // if there is image, show it 
                                        <Card.Img src={this.state.fileName}></Card.Img>
                                    }
                                </div>
                                <div style={{width:"100%", }}>
                                    <div style={{width:"50%", marginLeft:"25%", textAlign:"center"}}>
                                        {/* Alarm button */}
                                        <span style={{marginLeft:"0px", marginRight:"auto", fontSize:20, width:"49%", textAlign:"left",}}>Armed:</span>
                                        <span style={{marginLeft: "auto", marginRight: "0px", width:"49%", textAlign:"right"}}>
                                            <div style={{display:"inline-block"}}>
                                                <AlarmButton sx={{ m: 1}} checked={this.state.armed_state} onChange={this.handleArmedStatus}/>
                                            </div>
                                        </span>
                                    </div>
                                    <hr  style={{width:"50%", marginLeft:"25%"}}/>
                                    <div style={{width:"50%", marginLeft:"25%", textAlign:"center"}}>
                                        {/* monitor interval */}
                                        <span style={{marginLeft:"0px", marginRight:"auto", fontSize:20, width:"49%", textAlign:"left",}}>Monitor interval</span>
                                        <br/>
                                        <span style={{marginLeft: "auto", marginRight: "0px", width:"49%", textAlign:"right"}}>
                                            <div style={{display:"inline-block"}}>
                                                <SelectTimeInterval />
                                            </div>
                                        </span>
                                    </div>
                                </div>
                                <div style={{width:"100%", height:"10vh",}}></div>
                            </Card>
                        </div>
                        
                        <div style={{width:"100%", height:"10vh",}}></div>
                    </div>
                }
            </div>
        )
    }
};
