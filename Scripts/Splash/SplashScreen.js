import React, {useRef} from 'react';
import 
{
  View,
  Text,
  Platform,
  Animated,
  Easing,
  ImageBackground,
  PermissionsAndroid,
} 
from 'react-native';
import 
{
  getScreenWidth,
  fetchTimeout,
  encryptData,
  alertDialog,
} 
from '../../App.js';
import GLOBALS from '../../Globals.js';
import GetLocation from 'react-native-get-location'
import Geolocation from '@react-native-community/geolocation';
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

  async componentDidMount()
  {
    this.requestPermssion()
    this.handleAnimation()
  }
  
  handleAnimation = () => {
    Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: (GLOBALS.SPLASHSCREENTIME / 1.5),
        easing: Easing.ease
    }).start()
  }

  async requestPermssion()
  {
    if(Platform.OS === 'ios')
    {
      Geolocation.requestAuthorization()
      this.getInternetStatus()
    } else
    {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, 
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION]).then((granted) => {
          if (granted["android.permission.ACCESS_FINE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED && granted["android.permission.ACCESS_COARSE_LOCATION"] === PermissionsAndroid.RESULTS.GRANTED)
          {
            this.getInternetStatus()
          } else
          {
            alertDialog("Alert", "Location permission required to access this application.", "OK")
          }
      })
    }
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
    this.getCurrentLocation()
    this.startAnimationLoading(20, 700)
  }

  getCurrentLocation()
  {
    let lngLatitude = GLOBALS.LATITUDE
    let lngLongitude = GLOBALS.LONGITUDE
    Geolocation.getCurrentPosition((position) => {
      if(position.coords != undefined && position.coords != null)
      {
        if(position.coords.latitude != undefined && position.coords.latitude != null)
        {
          lngLatitude = position.coords.latitude
        }
        if(position.coords.longitude != undefined && position.coords.longitude != null)
        {
          lngLongitude = position.coords.longitude
        }
        this.requestCurrentWeather(lngLatitude, lngLongitude)
        this.startAnimationLoading(40, 600)
      }
      }, (error) => {
        this.requestCurrentWeather(lngLatitude, lngLongitude)
        this.startAnimationLoading(40, 600)
      }, {
        enableHighAccuracy: true, 
        timeout: 15000, 
        maximumAge: 1000},
    );
  }

  toHomeScreen()
  {
    this.props.navigation.navigate("Home")
    GLOBALS.CURRENT_SCREEN = "HOME"
  }

  requestCurrentWeather(latitude, longitude)
  {
    const dataParams = `?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&units=metric&cnt=1&appid=${GLOBALS.WEATHER_API_KEY}`
    fetchTimeout(GLOBALS.CURRENTWEATHER_API + dataParams, {
      method: 'POST',
      headers:{
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
    }).then(response=>{return response.json();})
      .then(data => {
        this.startAnimationLoading(60, 300)
        const arrayData = []
        arrayData.push(["CURRENT_WEATHER_API", String(encryptData("CURRENT_WEATHER_API", JSON.stringify(data)))])
        AsyncStorage.multiSet(arrayData, () => {
          setTimeout(() => 
          {
            this.requestOneCallWeather(latitude, longitude)
          }, 300)
        })
      }).catch((error)=>{
        this.requestOneCallWeather(latitude, longitude)
    })
  }

  requestOneCallWeather(latitude, longitude)
  {
    const dataParams = `?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&units=metric&exclude=minutely,hourly&appid=${GLOBALS.WEATHER_API_KEY}`
    fetchTimeout(GLOBALS.ONECALL_API + dataParams, {
      method: 'POST',
      headers:{
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
    }).then(response=>{return response.json();})
      .then(data => {
        this.startAnimationLoading(80, 300)
        const arrayData = []
        arrayData.push(["ONECALL_WEATHER", String(encryptData("ONECALL_WEATHER", JSON.stringify(data)))])
        AsyncStorage.multiSet(arrayData, () => {
          setTimeout(() => 
          {
            this.startAnimationLoading(100, 500)
          }, 300)
        })
      }).catch((error)=>{
        this.startAnimationLoading(100, 800)
    })
  }

}
