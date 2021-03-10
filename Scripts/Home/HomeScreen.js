import React, {useRef} from 'react';
import 
{
  View,
  Text,
  BackHandler,
  Alert,
  Image,
  Platform,
  ImageBackground,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ScrollView,
} 
from 'react-native';
import 
{
  getScreenWidth, 
  alertDialog,
  getData_Decrypt,
  getWeatherBackground,
  convertUnix,
  fetchTimeout,
  isBottomPadding,
} 
from '../../App.js';
import GLOBALS from '../../Globals.js';
import Geocoder from 'react-native-geocoding';
import AsyncStorage from '@react-native-community/async-storage';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default class HomeScreen extends React.Component 
{

  constructor(props) {
    super(props);
    this.state = 
    {
      bln_Loading: false,
      refreshing: false,
      progressStatus: 0,
      strCurrentLocationName: "Kuala Lumpur",
      objWeatherData: {},
      strWeather: "Clear",
      strWeatherIcon: "",
      arrayWeatherData: [],
      intTextWidth: 0,
      strTodayDate: "",
    }
  }

  componentDidMount()
  {
    this.init()
    if(GLOBALS.CURRENT_SCREEN != "HOME")
    {
      GLOBALS.CURRENT_SCREEN = "HOME"
    }
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }

  componentWillUnmount()
  {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
  }
  
  handleBackPress = () => {
    this.processBack()
    return true
  }

  processBack()
  {
    Alert.alert(
      "Alert",
      "Are you sure you want to exit the application?",
      [
        {text: "NO", style: "destructive", onPress: () => {} },
        {text: "YES", onPress: () => {BackHandler.exitApp()}},
      ],
      { cancelable: false }
    )
  }

  init()
  {
    this.getWeatherData()
    this.getLocationName()
  }

  getWeatherData()
  {
    AsyncStorage.getItem("WEATHER_API").then((value)=>
    {
      if(value != undefined && value != null && value != "")
      {
        const tempData = JSON.parse(getData_Decrypt("WEATHER_API", value))
        this.processData(tempData)
      } 
    })
  }

  processData(tempData)
  {
    if(tempData != undefined && tempData != null)
    {
      this.setState({
        bln_Loading: false,
        refreshing: false,
        objWeatherData: tempData,
        strWeather: tempData.current.weather[0].main,
        strTemperature: (tempData.current.temp * 1).toFixed(0),
        strWeatherIcon: GLOBALS.IMAGE_LINK + tempData.current.weather[0].icon + "@2x.png",
        strTodayDate: convertUnix(tempData.current.dt, "DD MMM YY (ddd)"),
        arrayWeatherData: tempData.daily,
      })
    }
  }

  _onRefreshWeather = () => {
    if(GLOBALS.INTERNET)
    {
      this.setState({
        refreshing: true,
      }, () => {
        setTimeout(() => 
        {
          this.requestCurrentWeather(GLOBALS.LATITUDE, GLOBALS.LONGITUDE)
        }, 300)
      })
    } else
    {
      if(this.state.refreshing)
      {
        this.setState({refreshing: false})
      }
    }
  }
  
  render() 
  {
    return (
      <View 
        style={{flex: 1, 
                backgroundColor: GLOBALS.THEMECOLOR,}}>
        <View
          style={{width: "100%",
                  height: "100%",}}>
          <ImageBackground
            style={{width: "100%",
                    height: "100%",}}
            resizeMode={"cover"}
            source={getWeatherBackground(this.state.strWeather)}>
            <SafeAreaView
              style={{flex: 1,
                      width: '100%',
                      height: '100%',}}>
              <View
                style={{width: "100%",
                        height: "100%",}}>
                <View
                  style={{width: "100%",
                          height: 48,
                          justifyContent: "center",}}>
                  <View
                    style={{width: "100%",
                            paddingLeft: 48,
                            paddingRight: 48,}}>
                    <Text
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      allowFontScaling={false}
                      style={{fontSize: 18,
                              width: "100%",
                              color: '#FFFFFF',
                              textAlign: "center",
                              fontFamily: "SFProText-Bold",
                              textShadowColor: GLOBALS.SHADOWCOLOR,
                              textShadowOffset: {width: -1, height: 1},
                              textShadowRadius: 1,}}>
                      {this.state.strCurrentLocationName}
                    </Text>
                  </View>
                </View>
                <View
                  style={{width: "100%",
                          height: "100%",}}>
                  <View
                    style={{width: "100%",
                            height: "30%",
                            justifyContent: "center",}}>
                    {this.renderWeatherText()}
                    {this.renderTemperatureText()}
                    {this.renderWeatherIcon()}
                  </View>
                  <View
                    style={{width: "100%",
                            height: "70%",}}>
                    <FlatList
                      refreshControl = {
                        <RefreshControl
                          colors={[GLOBALS.THEMECOLOR]}
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefreshWeather}/>
                      }
                      contentContainerStyle={{flexGrow: 1, paddingBottom: isBottomPadding() ? 48 : 16}}
                      data={this.state.arrayWeatherData}
                      keyExtractor = {(item, index) => index.toString()}
                      renderItem = {this._renderItemWeather}
                      initialNumToRender={7}/>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </ImageBackground>
        </View>
      </View>
    );
  }

  renderWeatherIcon()
  {
    if(this.state.strWeatherIcon != undefined && this.state.strWeatherIcon != null && this.state.strWeatherIcon != "")
    {
      return(
        <View
          style={{flexDirection: "row",
                  alignSelf: "center",}}>
          <Image 
            style={{width: 50,
                    height: 50,}}
            source={{uri: this.state.strWeatherIcon}}/>
          <View
            style={{justifyContent: "center",}}>
            <Text
              style={{fontSize: 18,
                      color: '#FFFFFF',
                      fontFamily: "SFProText-Regular",}}>
              {this.state.strTodayDate}
            </Text>
          </View>
        </View>
      )
    }
  }

  renderWeatherText()
  {
    if(this.state.strWeather != undefined && this.state.strWeather != null && this.state.strWeather != "")
    {
      return(
        <Text
          style={{color: '#FFFFFF',
                  fontSize: 22,
                  width: "100%",
                  textAlign: "center",
                  fontFamily: "SFProText-Regular",
                  textShadowColor: GLOBALS.SHADOWCOLOR,
                  textShadowOffset: {width: -1, height: 1},
                  textShadowRadius: 1,}}>
          {this.state.strWeather}
        </Text>
      )
    }
  }

  renderTemperatureText()
  {
    if(this.state.strTemperature != undefined && this.state.strTemperature != null && this.state.strTemperature != "")
    {
      return(
        <View
          style={{width: "100%",}}>
          <View
            style={{alignItems: "center"}}>
            <Text
              onLayout={(event) => {this.find_dimesions(event.nativeEvent.layout)}}
              style={{color: '#FFFFFF',
                      fontSize: 90,
                      textShadowColor: GLOBALS.SHADOWCOLOR,
                      textShadowOffset: {width: -1, height: 1},
                      textShadowRadius: 1,
                      fontFamily: "SFProText-Regular",}}>
              {this.state.strTemperature}
            </Text>
          </View>
          {this.renderDot()}
        </View>
      )
    }
  }

  renderDot()
  {
    if(this.state.intTextWidth != undefined && this.state.intTextWidth != null && this.state.intTextWidth != 0)
    {
      return(
        <View
          style={{position: "absolute",
                  alignSelf: "center",
                  flexDirection: "row",
                  paddingLeft: this.state.intTextWidth}}>
          <Text
            style={{color: '#FFFFFF',
                    fontSize: 65,
                    textShadowColor: GLOBALS.SHADOWCOLOR,
                    textShadowOffset: {width: -1, height: 1},
                    textShadowRadius: 1,}}>
            °
          </Text>
        </View>
      )
    }
  }

  find_dimesions(layout)
  {
    const { x, y, width, height } = layout
    if (width != 0 && height != 0)
    {
      this.setState({
        intTextWidth: width + 30,
      })
    }
  }

  getLocationName()
  {
    if(GLOBALS.LATITUDE != "" && GLOBALS.LONGITUDE != "")
    {
      if(Geocoder != undefined && Geocoder != null)
      {
        Geocoder.from({
          latitude : GLOBALS.LATITUDE,
          longitude : GLOBALS.LONGITUDE,
        }).then(json => {
          let intIndex = 0
          let strLocation = ""
          if(json.results[0].address_components.length > 1)
          {
            intIndex = 1
          }
          let addressComponent = json.results[0].address_components[intIndex]
          if(addressComponent.short_name != undefined && addressComponent.short_name != null && addressComponent.short_name != "")
          {
            strLocation = addressComponent.short_name
          }
          this.setState({
            strCurrentLocationName: strLocation
          })
        })
        .catch(error => {
          alertDialog("IN", JSON.stringify(error), "OK")
          console.log("DEBUG_ZR", JSON.stringify(error))
        })
      }
    }
  }

  requestCurrentWeather(latitude, longitude)
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
        this.processData(data)
        const arrayData = []
        arrayData.push(["WEATHER_API", String(encryptData("WEATHER_API", JSON.stringify(data)))])
        AsyncStorage.multiSet(arrayData, () => {
          
        })
      }).catch((error)=>{
    })
  }

  _renderItemWeather = ({item, index}) => {
    let intMargin = 5
    let strDate = convertUnix(item.dt, "DD MMM YY (ddd)")
    if(index == 0)
    {
      intMargin = 16
    }
    return(
      <TouchableOpacity
        style={{marginLeft: 16,
                marginRight: 16,
                marginTop: intMargin,
                borderRadius: 12,
                overflow: "hidden",
                backgroundColor: 'rgba(255, 255, 255, 0.40)',
                marginBottom: 5,
                paddingLeft: 12,
                paddingRight: 12,
                paddingTop: 8,
                paddingBottom: 8,}}
        onPress={()=> {this.clickIndividualItem(item)}}>
        <View
          style={{flexDirection: "row"}}>
          <View
            style={{width: 60,
                    height: 60,
                    borderRadius: 12,
                    overflow: "hidden",
                    backgroundColor: "#FFFFFF",
                    alignSelf: "center",}}>
            <Image
              style={{width: 60,
                      height: 60,}}
              source={{uri: GLOBALS.IMAGE_LINK + item.weather[0].icon + "@2x.png"}}/>
          </View>
          <View
            style={{marginLeft: 12,
                    width: "100%",
                    paddingRight: 95,
                    alignSelf: "center",}}>
            <View
              style={{flexDirection: "row",}}>
              <View
                style={{flex: 0.5,}}>
                <Text
                  style={{color: '#FFFFFF',
                          fontSize: 18,
                          textShadowColor: GLOBALS.SHADOWCOLOR,
                          textShadowOffset: {width: -1, height: 1},
                          textShadowRadius: 1,
                          fontFamily: "SFProText-Bold",}}>
                  {item.weather[0].main}
                </Text>
              </View>
              <View
                style={{flex: 0.5,
                        justifyContent: "flex-end",
                        flexDirection: "row"}}>
                <Text
                  style={{color: '#FFFFFF',
                          fontSize: 18,
                          paddingRight: 16,
                          fontFamily: "SFProText-Bold",}}>
                  {(item.temp.max).toFixed(0) + "°"}
                </Text>
                <Text
                  style={{color: '#FFFFFF',
                          fontSize: 18,
                          fontFamily: "SFProText-Regular",}}>
                  {(item.temp.min).toFixed(0) + "°"}
                </Text>
              </View>
            </View>
            <Text
              style={{color: '#FFFFFF',
                      fontSize: 18,
                      marginTop: 3,
                      fontFamily: "SFProText-Regular",}}>
              {strDate}
            </Text>
          </View>
          <View
            style={{position: "absolute",
                    right: 0,
                    alignSelf: "center",}}>
            <Image
              style={{width: 14,
                      height: 14,}}
              source={require("../../Images/Icon/rightarrow_black_icon.png")}/>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  clickIndividualItem(itemData)
  {
    this.props.navigation.navigate("Individual", {title: this.state.strCurrentLocationName})
  }

}
