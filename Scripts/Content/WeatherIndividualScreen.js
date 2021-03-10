import React, {useRef} from 'react';
import 
{
  View,
  Text,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Image,
  BackHandler,
  ImageBackground,
  FlatList,
} 
from 'react-native';
import 
{
  getScreenWidth,
  fetchTimeout,
  encryptData,
  alertDialog,
  getWeatherIndividualBackground,
  getScreenHeight,
  convertUnix,
} 
from '../../App.js';
import GLOBALS from '../../Globals.js';
import GetLocation from 'react-native-get-location'
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

export default class WeatherIndividualScreen extends React.Component 
{

  constructor(props) {
    super(props);
    this.state = 
    {
      bln_Loading: false,
      strTitle: "",
      strWeather: "",
      arrayHorlyData: [],
      strTemperature: "",
      intTextWidth: 0,
      strWeatherIcon: "",
      strTodayDate: "",
    }
  }

  componentDidMount()
  {
    const {params} = this.props.route
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
    this.setState({
      strTitle: strTitle,
      strWeather: strData.weather[0].main,
      arrayHorlyData: arrayHorlyData,
      strTemperature: (strData.temp.day).toFixed(0),
      strWeatherIcon: GLOBALS.IMAGE_LINK + strData.weather[0].icon + "@2x.png",
      strTodayDate: convertUnix(strData.dt, "DD MMM YY (ddd)"),
    })
    //MAIN DATA
  //   {
  //     "dt":1615352400,
  //     "sunrise":1615332076,
  //     "sunset":1615375567,
  //     "temp":{
  //        "day":34.65,
  //        "min":23.65,
  //        "max":35.54,
  //        "night":26.2,
  //        "eve":31.12,
  //        "morn":23.65
  //     },
  //     "feels_like":{
  //        "day":36.43,
  //        "night":30.25,
  //        "eve":33.78,
  //        "morn":26.33
  //     },
  //     "pressure":1011,
  //     "humidity":35,
  //     "dew_point":17.36,
  //     "wind_speed":0.81,
  //     "wind_deg":309,
  //     "weather":[
  //        {
  //           "id":500,
  //           "main":"Rain",
  //           "description":"light rain",
  //           "icon":"10d"
  //        }
  //     ],
  //     "clouds":34,
  //     "pop":0.66,
  //     "rain":1.07,
  //     "uvi":14.42
  //  }
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
    this.props.navigation.goBack()
  }
  
  render() 
  {
    return (
      <ImageBackground
        style={{width: "100%",
                height: "100%",}}
        source={getWeatherIndividualBackground(this.state.strWeather)}>
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
                  {this.state.strTitle}
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
                onPress={()=> {this.processBack()}}>
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
                  {this.renderWeatherText()}
                  {this.renderTemperatureText()}
                  {this.renderWeatherIcon()}
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
                    {this.renderHourlyData()}
                  </View>
                  <View
                    style={{width: "100%",
                            height: 1,
                            marginTop: 16,
                            backgroundColor: "#FFFFFF",}}>
                  </View>
                  <View
                    style={{marginTop: 16,}}>
                    
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
      
    );
  }

  //MAIN DATA
  //   {
  //     "dt":1615352400,
  //     "sunrise":1615332076,
  //     "sunset":1615375567,
  //     "temp":{
  //        "day":34.65,
  //        "min":23.65,
  //        "max":35.54,
  //        "night":26.2,
  //        "eve":31.12,
  //        "morn":23.65
  //     },
  //     "feels_like":{
  //        "day":36.43,
  //        "night":30.25,
  //        "eve":33.78,
  //        "morn":26.33
  //     },
  //     "pressure":1011,
  //     "humidity":35,
  //     "dew_point":17.36,
  //     "wind_speed":0.81,
  //     "wind_deg":309,
  //     "weather":[
  //        {
  //           "id":500,
  //           "main":"Rain",
  //           "description":"light rain",
  //           "icon":"10d"
  //        }
  //     ],
  //     "clouds":34,
  //     "pop":0.66,
  //     "rain":1.07,
  //     "uvi":14.42
  //  }

  renderHourlyData()
  {
    if(this.state.arrayHorlyData != undefined && this.state.arrayHorlyData != null && this.state.arrayHorlyData.length > 0)
    {
      return(
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          contentContainerStyle={{flexGrow: 1}}
          data={this.state.arrayHorlyData}
          keyExtractor = {(item, index) => index.toString()}
          renderItem = {this._renderItemHourlyWeather}/>
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
                  fontFamily: "SFProText-Regular",}}>
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
                    fontSize: 65,}}>
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
  
  _renderItemHourlyWeather = ({item, index}) => {
    let intMarginLeft = 5
    let intMarginRight = 5
    if(index == 0)
    {
      intMarginLeft = 16
    } else if(index == this.state.arrayHorlyData.length - 1)
    {
      intMarginRight = 16
    }
      //HOUR DATA 
//   {
//     "dt":1615399200,
// "main": {
//   "temp": 300.01,
//   "feels_like": 304.23,
//   "temp_min": 297.76,
//   "temp_max": 300.01,
//   "pressure": 1013,
//   "sea_level": 1013,
//   "grnd_level": 1001,
//   "humidity": 77,
//   "temp_kf": 2.25
// },
//     "weather":[
//        {
//           "id":500,
//           "main":"Rain",
//           "description":"light rain",
//           "icon":"10n"
//        }
//     ],
//     "clouds":{
//        "all":50
//     },
//     "wind":{
//        "speed":1.25,
//        "deg":81
//     },
//     "visibility":10000,
//     "pop":0.61,
//     "rain":{
//        "3h":0.93
//     },
//     "sys":{
//        "pod":"n"
//     },
//     "dt_txt":"2021-03-10 18:00:00"
//  },
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

}
