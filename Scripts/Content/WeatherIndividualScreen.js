import React, {useReducer, useEffect} from 'react';
import 
{
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  BackHandler,
  ImageBackground,
  FlatList,
  Linking,
} 
from 'react-native';
import 
{
  getScreenWidth,
  getWeatherIndividualBackground,
  getScreenHeight,
  convertUnix,
} 
from '../../App.js';
import GLOBALS from '../../Globals.js';
import { ScrollView } from 'react-native-gesture-handler';

function WeatherIndividualScreen(props)
{

  //Example of react native hook
  const [state, setState] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      strTitle: "",
      strWeather: "",
      arrayHorlyData: [],
      strTemperature: "",
      intTextWidth: 0,
      strWeatherIcon: "",
      strTodayDate: "",
      strSunrise: "",
      strSunset: "",
      strWindSpeed: "",
      strWindDegree: "",
      strCloud: "",
      strFeelLIke: "",
      strPreasure: "",
      strHumidity: "",
      strUVIndex: "",
    }
  )

  useEffect(() => {
    const {params} = props.route
    let strTitle = ""
    let strData = ""
    let arrayHorlyData = ""
    if(params != undefined && params != null)
    {
      if(params.title != undefined && params.title != null && params.title != "")
      {
        strTitle = params.title
      }
      if(params.data != undefined && params.data != null && params.data != "")
      {
        strData = params.data
      }
      if(params.hourlyData != undefined && params.hourlyData != null && params.hourlyData != "")
      {
        arrayHorlyData = params.hourlyData
      }
    }

    setState({
      strTitle: strTitle,
      strWeather: strData.weather[0].main,
      arrayHorlyData: arrayHorlyData,
      strTemperature: (strData.temp.day).toFixed(0),
      strWeatherIcon: GLOBALS.IMAGE_LINK + strData.weather[0].icon + "@2x.png",
      strTodayDate: convertUnix(strData.dt, "DD MMM YY (ddd)"),
      strSunrise: convertUnix(strData.sunrise, "h:mm a"),
      strSunset: convertUnix(strData.sunset, "h:mm a"),
      strWindSpeed: strData.wind_speed,
      strWindDegree: strData.wind_deg,
      strCloud: strData.clouds,
      strFeelLIke: (strData.feels_like.day).toFixed(0),
      strPreasure: strData.pressure,
      strHumidity: strData.humidity,
      strUVIndex: (strData.uvi).toFixed(0),
    })
    BackHandler.addEventListener('hardwareBackPress', handleBackPress)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
    }
  }, [])

  const handleBackPress = () => {
    processBack()
    return true
  }

  const processBack = () => {
    props.navigation.goBack()
  }

  const renderHourlyData = () =>
  {
    if(state.arrayHorlyData != undefined && state.arrayHorlyData != null && state.arrayHorlyData.length > 0)
    {
      return(
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          contentContainerStyle={{flexGrow: 1}}
          data={state.arrayHorlyData}
          keyExtractor = {(item, index) => index.toString()}
          renderItem = {_renderItemHourlyWeather}/>
      )
    } else
    {
      return(
        <View
          style={{height: 100,
                  justifyContent: "center",}}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            allowFontScaling={false}
            style={{color: '#FFFFFF',
                    fontSize: 16,
                    width: "100%",
                    textAlign: "center",
                    fontFamily: "SFProText-Regular",}}>
            There is no hourly data available at the moment
          </Text>
        </View>
      )
    }
  }

  const renderWeatherText = () =>
  {
    if(state.strWeather != undefined && state.strWeather != null && state.strWeather != "")
    {
      return(
        <Text
          style={{color: '#FFFFFF',
                  fontSize: 22,
                  width: "100%",
                  textAlign: "center",
                  fontFamily: "SFProText-Regular",}}>
          {state.strWeather}
        </Text>
      )
    }
  }

  const renderTemperatureText = () =>
  {
    if(state.strTemperature != undefined && state.strTemperature != null && state.strTemperature != "")
    {
      return(
        <View
          style={{width: "100%",}}>
          <View
            style={{alignItems: "center"}}>
            <Text
              onLayout={(event) => {find_dimesions(event.nativeEvent.layout)}}
              style={{color: '#FFFFFF',
                      fontSize: 90,
                      fontFamily: "SFProText-Regular",}}>
              {state.strTemperature}
            </Text>
          </View>
          {renderDot()}
        </View>
      )
    }
  }

  const renderDot = () =>
  {
    if(state.intTextWidth != undefined && state.intTextWidth != null && state.intTextWidth != 0)
    {
      return(
        <View
          style={{position: "absolute",
                  alignSelf: "center",
                  flexDirection: "row",
                  paddingLeft: state.intTextWidth}}>
          <Text
            style={{color: '#FFFFFF',
                    fontSize: 65,}}>
            °
          </Text>
        </View>
      )
    }
  }

  const find_dimesions = (layout) =>
  {
    const { x, y, width, height } = layout
    if (width != 0 && height != 0)
    {
      setState({
        intTextWidth: width + 30,
      })
    }
  }

  const renderWeatherIcon = () =>
  {
    if(state.strWeatherIcon != undefined && state.strWeatherIcon != null && state.strWeatherIcon != "")
    {
      return(
        <View
          style={{flexDirection: "row",
                  alignSelf: "center",}}>
          <Image 
            style={{width: 50,
                    height: 50,}}
            source={{uri: state.strWeatherIcon}}/>
          <View
            style={{justifyContent: "center",}}>
            <Text
              style={{fontSize: 18,
                      color: '#FFFFFF',
                      fontFamily: "SFProText-Regular",}}>
              {state.strTodayDate}
            </Text>
          </View>
        </View>
      )
    }
  }
  
  const _renderItemHourlyWeather = ({item, index}) => {
    let intMarginLeft = 5
    let intMarginRight = 5
    if(index == 0)
    {
      intMarginLeft = 16
    } else if(index == state.arrayHorlyData.length - 1)
    {
      intMarginRight = 16
    }
    return(
      <View
        style={{marginLeft: intMarginLeft,
                marginRight: intMarginRight,
                borderRadius: 12,
                overflow: "hidden",
                backgroundColor: 'rgba(255, 255, 255, 0.40)',
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 16,
                paddingBottom: 16,
                width: 100,
                height: 160,
                justifyContent: "center",
                alignItems: "center",}}>
        <Text
          style={{color: '#FFFFFF',
                  fontSize: 16,
                  fontFamily: "SFProText-Bold",}}>
          {convertUnix(item.dt, "h:mm a")}
        </Text>
        <Image
          style={{width: 50,
                  height: 50,
                  marginTop: 4,
                  marginBottom: 4,}}
          source={{uri: GLOBALS.IMAGE_LINK + item.weather[0].icon + "@2x.png"}}/>
        <View
          style={{width: "100%",
                  flexDirection: "row",}}>
          <View
            style={{flex: 0.5,}}>
            <Text
              style={{color: '#FFFFFF',
                      fontSize: 16,
                      alignSelf: "center",
                      fontFamily: "SFProText-Bold",}}>
              {(item.main.temp_min).toFixed(0) + "°"}
            </Text>
          </View>
          <View
            style={{flex: 0.5}}>
            <Text
              style={{color: '#FFFFFF',
                      fontSize: 16,
                      alignSelf: "center",
                      fontFamily: "SFProText-Bold",}}>
              {(item.main.temp_max).toFixed(0) + "°"}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  const clickWebLink = (strWebLink) => 
  {
    Linking.openURL(strWebLink)
  }

  return (
    <ImageBackground
      style={{width: "100%",
              height: "100%",}}
      source={getWeatherIndividualBackground(state.strWeather)}>
      <SafeAreaView
        style={{width: '100%',
                height: '100%',
                flex: 1,}}>
        <View
          style={{flex: 1,
                  width: "100%",
                  height: "100%"}}>
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
                        fontFamily: "SFProText-Bold",}}>
                {state.strTitle}
              </Text>
            </View>
            <TouchableOpacity
              style={{width: 48,
                      height: 48,
                      padding: 5,
                      left: 0,
                      position:'absolute',
                      alignItems:  "center" ,
                      justifyContent: "center",}}
              onPress={()=> {processBack()}}>
              <Image 
                style = {{width: 24,
                          height: 24,}}
                source={require("../../Images/Icon/back_icon.png")}/>
            </TouchableOpacity>
          </View>
          <View
            style={{width: "100%",
                    height: "100%",
                    flex: 1,}}>
            <ScrollView>
              <View
                style={{width: "100%",
                        height: getScreenHeight() * 30 /100,
                        justifyContent: "center",}}>
                {renderWeatherText()}
                {renderTemperatureText()}
                {renderWeatherIcon()}
              </View>
              <View
                style={{width: "100%",
                        height: "100%",
                        flex: 1,
                        justifyContent: "center",}}>
                <View
                  style={{width: "100%",
                          height: 1,
                          backgroundColor: "#FFFFFF",}}>
                </View>
                <View
                  style={{marginTop: 16,}}>
                  {renderHourlyData()}
                </View>
                <View
                  style={{width: "100%",
                          height: 1,
                          marginTop: 16,
                          backgroundColor: "#FFFFFF",}}>
                </View>
                <View
                  style={{marginTop: 16,}}>
                  <View
                    style={{flexDirection: "row",
                            width: "100%",
                            paddingLeft: 16,
                            paddingRight: 16,}}>
                    <View
                      style={{flex: 0.5}}>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 14,
                                fontFamily: "SFProText-Regular",}}>
                        SUNRISE
                      </Text>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 24,
                                marginTop: 3,
                                textShadowColor: GLOBALS.SHADOWCOLOR,
                                textShadowOffset: {width: -1, height: 1},
                                textShadowRadius: 1,
                                fontFamily: "SFProText-Bold",}}>
                        {state.strSunrise}
                      </Text>
                    </View>
                    <View
                      style={{flex: 0.5}}>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 14,
                                fontFamily: "SFProText-Regular",}}>
                        SUNSET
                      </Text>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 24,
                                marginTop: 3,
                                textShadowColor: GLOBALS.SHADOWCOLOR,
                                textShadowOffset: {width: -1, height: 1},
                                textShadowRadius: 1,
                                fontFamily: "SFProText-Bold",}}>
                        {state.strSunset}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{width: getScreenWidth() - 32,
                            height: 1,
                            marginTop: 16,
                            backgroundColor: "#FFFFFF",
                            alignSelf: "center",  }}>
                  </View>
                  <View
                    style={{flexDirection: "row",
                            width: "100%",
                            marginTop: 16,
                            paddingLeft: 16,
                            paddingRight: 16,}}>
                    <View
                      style={{flex: 0.5}}>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 14,
                                fontFamily: "SFProText-Regular",}}>
                        WIND
                      </Text>
                      <Text
                        style={{marginTop: 3,}}>
                        <Text
                          style={{color: '#FFFFFF',
                                  fontSize: 24,
                                  textShadowColor: GLOBALS.SHADOWCOLOR,
                                  textShadowOffset: {width: -1, height: 1},
                                  textShadowRadius: 1,
                                  fontFamily: "SFProText-Bold",}}>
                          {state.strWindSpeed}
                        </Text>
                        <Text
                          adjustsFontSizeToFit
                          numberOfLines={1}
                          allowFontScaling={false}
                          style={{color: '#FFFFFF',
                                  fontSize: 16,
                                  textShadowColor: GLOBALS.SHADOWCOLOR,
                                  textShadowOffset: {width: -1, height: 1},
                                  textShadowRadius: 1,
                                  fontFamily: "SFProText-Bold",}}>
                          {" m/s"}
                        </Text>
                      </Text>
                    </View>
                    <View
                      style={{flex: 0.5}}>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 14,
                                fontFamily: "SFProText-Regular",}}>
                        WIND DIRECTION
                      </Text>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 24,
                                marginTop: 3,
                                textShadowColor: GLOBALS.SHADOWCOLOR,
                                textShadowOffset: {width: -1, height: 1},
                                textShadowRadius: 1,
                                fontFamily: "SFProText-Bold",}}>
                        {state.strWindDegree + "°"}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{width: getScreenWidth() - 32,
                            height: 1,
                            marginTop: 16,
                            backgroundColor: "#FFFFFF",
                            alignSelf: "center",  }}>
                  </View>
                  <View
                    style={{flexDirection: "row",
                            width: "100%",
                            marginTop: 16,
                            paddingLeft: 16,
                            paddingRight: 16,}}>
                    <View
                      style={{flex: 0.5}}>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 14,
                                fontFamily: "SFProText-Regular",}}>
                        CLOUDINESS
                      </Text>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 24,
                                marginTop: 3,
                                textShadowColor: GLOBALS.SHADOWCOLOR,
                                textShadowOffset: {width: -1, height: 1},
                                textShadowRadius: 1,
                                fontFamily: "SFProText-Bold",}}>
                        {state.strCloud + "%"}
                      </Text>
                    </View>
                    <View
                      style={{flex: 0.5}}>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 14,
                                fontFamily: "SFProText-Regular",}}>
                        FEELS LIKE
                      </Text>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 24,
                                marginTop: 3,
                                textShadowColor: GLOBALS.SHADOWCOLOR,
                                textShadowOffset: {width: -1, height: 1},
                                textShadowRadius: 1,
                                fontFamily: "SFProText-Bold",}}>
                        {state.strFeelLIke + "°"}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{width: getScreenWidth() - 32,
                            height: 1,
                            marginTop: 16,
                            backgroundColor: "#FFFFFF",
                            alignSelf: "center",  }}>
                  </View>
                  <View
                    style={{flexDirection: "row",
                            width: "100%",
                            marginTop: 16,
                            paddingLeft: 16,
                            paddingRight: 16,}}>
                    <View
                      style={{flex: 0.5}}>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 14,
                                fontFamily: "SFProText-Regular",}}>
                        PREASURE
                      </Text>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 24,
                                marginTop: 3,
                                textShadowColor: GLOBALS.SHADOWCOLOR,
                                textShadowOffset: {width: -1, height: 1},
                                textShadowRadius: 1,
                                fontFamily: "SFProText-Bold",}}>
                        {state.strPreasure + " hPa"}
                      </Text>
                    </View>
                    <View
                      style={{flex: 0.5}}>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 14,
                                fontFamily: "SFProText-Regular",}}>
                        HUMIDITY
                      </Text>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 24,
                                marginTop: 3,
                                textShadowColor: GLOBALS.SHADOWCOLOR,
                                textShadowOffset: {width: -1, height: 1},
                                textShadowRadius: 1,
                                fontFamily: "SFProText-Bold",}}>
                        {state.strHumidity + "%"}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{width: getScreenWidth() - 32,
                            height: 1,
                            marginTop: 16,
                            backgroundColor: "#FFFFFF",
                            alignSelf: "center",  }}>
                  </View>
                  <View
                    style={{flexDirection: "row",
                            width: "100%",
                            marginTop: 16,
                            paddingLeft: 16,
                            paddingRight: 16,}}>
                    <View
                      style={{flex: 0.5}}>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 14,
                                fontFamily: "SFProText-Regular",}}>
                        UV INDEX
                      </Text>
                      <Text
                        style={{color: '#FFFFFF',
                                fontSize: 24,
                                marginTop: 3,
                                textShadowColor: GLOBALS.SHADOWCOLOR,
                                textShadowOffset: {width: -1, height: 1},
                                textShadowRadius: 1,
                                fontFamily: "SFProText-Bold",}}>
                        {state.strUVIndex}
                      </Text>
                    </View>
                    <View
                      style={{flex: 0.5}}>
                      
                    </View>
                  </View>
                  <View
                    style={{width: "100%",
                            height: 1,
                            marginTop: 16,
                            marginBottom: 16,
                            backgroundColor: "#FFFFFF",
                            alignSelf: "center",  }}>
                  </View>
                  <TouchableOpacity
                    onPress={()=> {clickWebLink("https://openweathermap.org/")}}>
                    <Text
                      style={{color: '#FFFFFF',
                              fontSize: 18,
                              paddingLeft: 16,
                              paddingRight: 16,
                              fontFamily: "SFProText-Regular",}}>
                      https://openweathermap.org/
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{width: "100%",
                            height: 1,
                            marginTop: 16,
                            marginBottom: 16,
                            backgroundColor: "#FFFFFF",
                            alignSelf: "center",  }}>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )

}

export default WeatherIndividualScreen
