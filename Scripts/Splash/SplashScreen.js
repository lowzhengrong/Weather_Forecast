import React, {useRef} from 'react';
import 
{
  View,
  Text,
  Platform,
  Animated,
  Easing,
  ImageBackground,
} 
from 'react-native';
import 
{
  getScreenWidth,
  fetchTimeout,
  encryptData,
} 
from '../../App.js';
import GLOBALS from '../../Globals.js';
import GetLocation from 'react-native-get-location'
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';

export default class SplashScreen extends React.Component 
{

  constructor(props) {
    super(props);
    this.state = 
    {
      bln_Loading: false,
      progressStatus: 0,
    }
    this.animatedValue = new Animated.Value(0)
    this.animatedProgress = new Animated.Value(0)
  }

  componentDidMount()
  {
    this.handleAnimation()
    this.getInternetStatus()
  }
  
  handleAnimation = () => {
    Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: (GLOBALS.SPLASHSCREENTIME / 1.5),
        easing: Easing.ease
    }).start()
  }

  render() 
  {
    return (
      <View
        style={{width: '100%',
                height: '100%',
                flex: 1,
                backgroundColor: GLOBALS.THEMECOLOR,}}>
        <ImageBackground
          style={{width: "100%",
                  height: "100%",
                  flex: 1,}}
          source={require("../../Images/Splash/bg_splash_blur.png")}>
          <View
            style={{width: '100%',
                    height: '100%',
                    position: 'absolute',
                    alignItems: "center" ,
                    justifyContent: "center"}}>
            <Animated.Image
              style={{width: getScreenWidth() / 2,
                      height: 300,
                      transform: [
                        {
                            scaleX: this.animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1]
                            })
                        },
                        {
                            scaleY: this.animatedValue.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 1]
                            })
                        }
                      ],
                    }}
              resizeMode='contain'
              source={require("../../Images/Splash/logo_splash.png")}/>
          </View>
          <View
            style={{position: "absolute",
                    bottom: 0,}}>
            <View
              style={{width: getScreenWidth(),
                      height: 35,
                      backgroundColor: "#000000",
                      justifyContent: "center",}}>
              <Animated.View 
                style={[  
                  {
                    width: "100%",  
                    height: 30,
                    backgroundColor: GLOBALS.PROGRESSBARCOLOR,}, 
                  {width: this.state.progressStatus +"%"},  
                ]}/>
              <View
                style={{width: getScreenWidth(),
                        position: "absolute",
                        bottom: 15,}}>
                <Text
                  style={{color: '#FFFFFF',
                          fontSize: 32,
                          fontFamily: "SFProText-Bold",
                          textShadowColor: "#000000",
                          textShadowOffset: {width: 2, height: 2},
                          textAlign: 'center',
                          textShadowRadius: 2,}}>
                  {this.state.progressStatus + "%"}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  startAnimationLoading = (toValue, intDuration) => {
    this.animatedProgress.addListener(({value})=> {  
      this.setState({
        progressStatus: parseInt(value, 10)
      }, ()=> {
        if(value >= 100)
        {
          setTimeout(() => 
          {
            this.toHomeScreen()
          }, 300)
        }
      })
    });
    var intValue = toValue
    if(intValue >= 100)
    {
      intValue = 100
    }
    Animated.timing(this.animatedProgress, {
        toValue: intValue,
        duration: intDuration,
    }).start()
  }

  getInternetStatus()
  {
  //   {
  //     "type":"wifi",
  //     "isConnected":true,
  //     "details":{
  //        "subnet":"255.255.255.0",
  //        "isConnectionExpensive":false,
  //        "ssid":null,
  //        "bssid":null,
  //        "ipAddress":"192.168.1.204"
  //     },
  //     "isInternetReachable":true
  //  }
  if(GLOBALS.INTERNET)
  {
    setTimeout(() => 
    {
      this.getCurrentLocation()
    }, 200)
    this.startAnimationLoading(20, 700)
  } else
  {
    this.startAnimationLoading(100, GLOBALS.SPLASHSCREENTIME)
  }
    // NetInfo.fetch().then(state => {
    //   if(state.isInternetReachable)
    //   {
    //     GLOBALS.INTERNET = state.isConnected
    //   } else
    //   {
    //     GLOBALS.INTERNET = false
    //   }
    //   if(GLOBALS.INTERNET)
    //   {
    //     setTimeout(() => 
    //     {
    //       this.getCurrentLocation()
    //     }, 200)
    //     this.startAnimationLoading(20, 700)
    //   } else
    //   {
    //     this.startAnimationLoading(100, GLOBALS.SPLASHSCREENTIME)
    //   }
    // });
  }

  getCurrentLocation()
  {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
    .then(location => {
    //   {
    //     "verticalAccuracy":10,
    //     "longitude":101.63563549244554,
    //     "accuracy":65,
    //     "time":1615192554574.9988,
    //     "speed":-1,
    //     "course":-1,
    //     "latitude":3.2201231373252357,
    //     "altitude":67.080162525177
    //  }
      let lngLatitude = ""
      let lngLongitude = ""
      if(location != undefined && location != null)
      {
        if(location.latitude != undefined && location.latitude != null)
        {
          lngLatitude = location.latitude
        }
        if(location.longitude != undefined && location.longitude != null)
        {
          lngLongitude = location.longitude
        }
      }
      if(lngLatitude == "" && lngLatitude == "")
      {
        lngLatitude = GLOBALS.LATITUDE
        lngLatitude = GLOBALS.LONGITUDE
      }
      this.startAnimationLoading(40, 600)
      this.requestCurrentWeather(lngLatitude, lngLongitude)
    })
    .catch(error => {
        const { code, message } = error
        if(String(code) == "UNAVAILABLE" ||
           String(code) == "TIMEOUT" ||
           String(code) == "UNAUTHORIZED")
        {
          this.startAnimationLoading(40, 600)
          this.requestCurrentWeather(GLOBALS.LATITUDE, GLOBALS.LONGITUDE)
        }
    })
  }

  toHomeScreen()
  {
    this.props.navigation.navigate("Home")
    GLOBALS.CURRENT_SCREEN = "HOME"
  }

  requestCurrentWeather(latitude, longitude)
  {
    const dataParams = `?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&units=metric&exclude=minutely,hourly&appid=${GLOBALS.WEATHER_API_KEY}`
    // console.log("DEBUG_ZR", GLOBALS.ONECALL_API + 
    // `?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&exclude=weekly&appid=b51b1d6ef10a92fb6bfc9ab4ad8b98df`)
    // console.log("DEBUG_ZR", GLOBALS.ONECALL_API + dataParams)
    fetchTimeout(GLOBALS.ONECALL_API + dataParams, {
      method: 'POST',
      headers:{
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
    }).then(response=>{return response.json();})
      .then(data => {
        this.startAnimationLoading(60, 200)
        const arrayData = []
        arrayData.push(["WEATHER_API", String(encryptData("WEATHER_API", JSON.stringify(data)))])
        AsyncStorage.multiSet(arrayData, () => {
          setTimeout(() => 
          {
            this.startAnimationLoading(100, 600)
          }, 300)
        })
      }).catch((error)=>{
        this.startAnimationLoading(100, 800)
    })
  }

}
