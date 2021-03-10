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
  encryptData,
} 
from '../../App.js';
import GLOBALS from '../../Globals.js';
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
      strWeather: "",
      strWeatherIcon: "",
      arrayWeatherData: [],
      intTextWidth: 0,
      strTodayDate: "",
      arrayForecast: [],
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
  }

  getWeatherData()
  {
    AsyncStorage.multiGet(
      ["CURRENT_WEATHER_API", "ONECALL_WEATHER", "FORECAST_WEATHER"]
    ).then(response => {
      let currentWeather = {}
      let onecallWeather = {}
      if(response[0][1] != undefined && response[0][1] != null && response[0][1] != "")
      {
        currentWeather = JSON.parse(getData_Decrypt(response[0][0], response[0][1]))
      }
      if(response[1][1] != undefined && response[1][1] != null && response[1][1] != "")
      {
        onecallWeather = JSON.parse(getData_Decrypt(response[1][0], response[1][1]))
      }
      if(response[2][1] != undefined && response[2][1] != null && response[2][1] != "")
      {
        this.state.arrayForecast = JSON.parse(getData_Decrypt(response[2][0], response[2][1]))
      }
      this.processData(currentWeather, onecallWeather, "init")
    })
  }

  processData(currentWeather, onecallWeather, strAction)
  {
    let strCurrentLocationName = this.state.strCurrentLocationName
    if(strAction != undefined && strAction != null)
    {
      if(strAction == "init")
      {
        strCurrentLocationName = currentWeather.list[0].name
      }
    }
    this.setState({
      bln_Loading: false,
      refreshing: false,
      strCurrentLocationName: strCurrentLocationName,
      strWeather: onecallWeather.current.weather[0].main,
      strTemperature: (onecallWeather.current.temp * 1).toFixed(0),
      strWeatherIcon: GLOBALS.IMAGE_LINK + onecallWeather.current.weather[0].icon + "@2x.png",
      strTodayDate: convertUnix(onecallWeather.current.dt, "DD MMM YY (ddd)"),
      arrayWeatherData: onecallWeather.daily,
    }, ()=> {
      if(GLOBALS.INTERNET)
      {
        this.requestForecast(GLOBALS.LATITUDE, GLOBALS.LONGITUDE)
      }
    })
  }

  _onRefreshWeather = () => {
    if(GLOBALS.INTERNET)
    {
      this.setState({
        refreshing: true,
      }, () => {
        setTimeout(() => 
        {
          this.requestOneCallWeather(GLOBALS.LATITUDE, GLOBALS.LONGITUDE)
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
        const arrayData = []
        arrayData.push(["ONECALL_WEATHER", String(encryptData("ONECALL_WEATHER", JSON.stringify(data)))])
        AsyncStorage.multiSet(arrayData, () => {
          this.processData("", data, "")
        })
      }).catch((error)=>{
    })
  }

  requestForecast(latitude, longitude)
  {
    const dataParams = `?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&units=metric&&appid=${GLOBALS.WEATHER_API_KEY}`
    fetchTimeout(GLOBALS.FORECAST_API + dataParams, {
      method: 'POST',
      headers:{
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
    }).then(response=>{return response.json();})
      .then(data => {
        if(data.list != undefined && data.list != null)
        {
          this.state.arrayForecast = data.list
          const arrayData = []
          arrayData.push(["FORECAST_WEATHER", String(encryptData("FORECAST_WEATHER", JSON.stringify(data.list)))])
          AsyncStorage.multiSet(arrayData, () => {
          })
        }
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
        onPress={()=> {this.clickIndividualItem(item, convertUnix(item.dt, "DD-MM-YYYY"))}}>
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

  clickIndividualItem(itemData, strDate)
  {
    const arrayData = []
    if(this.state.arrayForecast != undefined && this.state.arrayForecast != null && this.state.arrayForecast.length > 0)
    {
      for(var x = 0; x < this.state.arrayForecast.length; x++)
      {
        const contentData = this.state.arrayForecast[x]
        if(contentData != undefined && contentData != null)
        {
          if(String(convertUnix(contentData.dt, "DD-MM-YYYY")) == String(strDate))
          {
            arrayData.push(contentData)
          }
        }
      }
    }
    if(arrayData != undefined && arrayData != null && arrayData.length > 0)
    {
      this.props.navigation.navigate("Individual", {title: this.state.strCurrentLocationName, data: itemData, hourlyData: arrayData})
    } else
    {
      Alert.alert(
        "Alert",
        "Unable to display the hourly data due to the limitation of the api.",
        [
          {text: "OK", onPress: () => {
            this.props.navigation.navigate("Individual", {title: this.state.strCurrentLocationName, data: itemData, hourlyData: arrayData})
          }},
        ],
        { cancelable: false }
      )
    }
  }

}
