/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  Dimensions,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GLOBALS from './Globals.js';
import CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
import moment from 'moment'
import Config from "react-native-config";
import DeviceInfo from 'react-native-device-info'

import SplashScreen from './Scripts/Splash/SplashScreen'
import HomeScreen from './Scripts/Home/HomeScreen'
import WeatherIndividualScreen from './Scripts/Content/WeatherIndividualScreen'

export function getScreenWidth()
{
  return Dimensions.get('window').width
}

export function getScreenHeight()
{
  return Dimensions.get('window').height
}

export function isBottomPadding()
{
  let bln_Btm = false
  if(isIphone12series())
  {
    bln_Btm = true
  } else if(isIphoneX())
  {
    bln_Btm = true
  }
  return bln_Btm
}

export function isIphone12series()
{
  let d = Dimensions.get('window')
  const { height, width } = d
  if(Platform.OS === 'ios' && 
      (width === 375 && height === 812) || 
      (width === 390 && height === 844) ||
      (width === 428 && height === 926))
  {
    return true
  } else
  {
    return false
  }
}

export function isIphoneX()
{
  let d = Dimensions.get('window')
  const { height, width } = d
  if(Platform.OS === 'ios' && (width === 812 || height === 812) || (width === 896 || height === 896))
  {
    return true
  } 
  else if (Platform.OS === 'ios' && isTablet() && (width >= 834 || height >= 834) && (height >= 1194 || width >= 1194)) {
    return true
  }
  else
  {
    return false
  }
}

export function isTablet()
{
  return DeviceInfo.isTablet()
}

export function fetchTimeout(url, options)
{
  options = options || {};
  //default 30s
  var timeout = 1000 * 30
  if(options != undefined && options != null)
  {
    if(options.body != undefined && options.body != null)
    {
      if(options.body._parts != undefined && options.body._parts != null)
      {
      } else
      {
        const objData = JSON.parse(options.body)
        if(objData.data != undefined && objData.data != null)
        {
        }
      }
    }
  }
  const errorMessage = {
    message: "Timeout:" + (timeout / 1000) + "s"
  }
  return timeoutPromise(fetch(url, options), timeout, errorMessage);
}

export function timeoutPromise(promise, timeout, error) {
  var fetch_promise = new Promise((resolve, reject) => {
    promise.then(resolve, reject);
  });

  var abort_promise =  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(error);
    }, timeout);
  });  

  var abortable_promise = Promise.race([
    fetch_promise,
    abort_promise
  ]);
  return abortable_promise;
}

export function toLowerCase(text)
{
  if(text != null && text != undefined && text.length > 0)
  {
    return text.toLowerCase()
  } else
  {
    return ""
  }
}

export function toUpperCase(text)
{
  if(text != null && text != undefined && text.length > 0)
  {
    return text.toUpperCase()
  } else
  {
    return ""
  }
}

export function getPlatform()
{
  return Platform.OS
}

export function isIOS()
{
  if(Platform.OS == "android")
  {
    return false
  }
  return true
}

export function isAndroid()
{
  if(Platform.OS == "android")
  {
    return true
  }
  return false
}

export function encryptData(key, value)
{
  var ciphertext = CryptoJS.AES.encrypt(value, key)
  return ciphertext
}

export function alertDialog(title , msg , action)
{
  var strTitle = "Alert"
  var strMsg = ""
  var strAction = "OK"
  if(title != null && title.length != 0)
  {
    strTitle = title
  }
  if(msg != null && msg.length != 0)
  {
    strMsg = msg
  }
  if(action != null && action.length != 0)
  {
    strAction = action
  }
  Alert.alert(
    strTitle,
    strMsg,
    [
      {text: strAction},
    ],
    { cancelable: false }
  )
}

export function storeData_Encrypt(key , value) 
{
  var ciphertext = CryptoJS.AES.encrypt(value, key)
  storeData(key,ciphertext.toString())
}

export function getData_Decrypt(key , value) 
{
  var bytes  = CryptoJS.AES.decrypt(value, key)
  var plaintext = bytes.toString(CryptoJS.enc.Utf8)
  return plaintext
}

export function storeData(key , value) 
{
  AsyncStorage.setItem(key, value)
}

export function getWeatherIndividualBackground(strWeather)
{
  if(strWeather == "")
  {
    return
  }
  if(strWeather == "Thunderstorm")
  {
    return require("./Images/Weather/img_bg_storm.png")
  } else if(strWeather == "Drizzle" || strWeather == "Rain")
  {
    return require("./Images/Weather/img_bg_rain.png")
  } else if(strWeather == "Snow")
  {
    return require("./Images/Weather/img_bg_snow.png")
  } else if(strWeather == "Clear")
  {
    return require("./Images/Weather/img_bg_clear.png")
  } else if(strWeather == "Clouds")
  {
    return require("./Images/Weather/img_bg_cloudy.png")
  } else
  {
    return require("./Images/Weather/img_bg_hazy.png")
  }
}

export function getWeatherBackground(strWeather)
{
  if(strWeather == "")
  {
    return
  }
  if(strWeather == "Thunderstorm")
  {
    return require("./Images/Weather/brief_thundershower.png")
  } else if(strWeather == "Drizzle" || strWeather == "Rain")
  {
    return require("./Images/Weather/brief_rain.png")
  } else if(strWeather == "Snow")
  {
    return require("./Images/Weather/brief_snow.png")
  } else if(strWeather == "Clear")
  {
    return require("./Images/Weather/brief_sunny.png")
  } else if(strWeather == "Clouds")
  {
    return require("./Images/Weather/brief_cloudy.png")
  } else
  {
    return require("./Images/Weather/brief_fog.png")
  }
}

export function convertUnix(intUnix, strFormat)
{
  let strTemp = "DD-MM-YYYY HH:mm:ss"
  if(strFormat != undefined && strFormat != null && strFormat != "")
  {
    strTemp = strFormat
  }
  return moment.unix(intUnix).format(strTemp)
}

export function getRandomInt(intMaxNumber)
{
  return Math.floor(Math.random() * Math.floor(intMaxNumber))
}

const Stack = createStackNavigator();

export default class App extends Component<Props> {

  constructor(props) {
    super(props)
  }

  componentDidMount() 
  {
    console.disableYellowBox = !GLOBALS.DEBUG
    NetInfo.addEventListener(state => {
      if(state.isInternetReachable)
      {
        GLOBALS.INTERNET = state.isConnected
      } else
      {
        GLOBALS.INTERNET = false
      }
    });
    // if(Geocoder != undefined && Geocoder != null)
    // {
    //   Geocoder.init(Config.REACT_APP_GEOCODER_API_KEY)
    // }
    GLOBALS.IMAGE_LINK = Config.REACT_APP_IMAGE_LINK
    GLOBALS.WEATHER_API_KEY = Config.REACT_APP_WEATHER_API_KEY
  }

  componentWillUnmount()
  {

  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen 
            name="Splash" 
            options={{headerShown: false,}} 
            component={SplashScreen}/>
          <Stack.Screen 
            name="Home" 
            options={{headerShown: false,}} 
            component={HomeScreen}/>
          <Stack.Screen 
            name="Individual" 
            options={{headerShown: false,}} 
            component={WeatherIndividualScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }

}
